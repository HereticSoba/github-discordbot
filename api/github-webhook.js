const axios = require('axios');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Configurado para peticiones POST.' });
    }

    const event = req.headers['x-github-event'];
    const body = req.body || {};
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

    if (event === 'ping') {
        return res.status(200).json({ message: 'Conexión exitosa con GitHub Webhook.' });
    }

    if (!DISCORD_WEBHOOK_URL) {
        console.error('Falta variable de entorno DISCORD_WEBHOOK_URL');
        return res.status(500).json({ error: 'Configuración del servidor incompleta.' });
    }

    let discordMessage = '';

    if (event === 'push') {
        const repo = body.repository?.full_name || 'Repositorio';
        const pusher = body.pusher?.name || 'Alguien';
        const commitsCount = body.commits?.length || 0;
        const compareUrl = body.compare;

        discordMessage = `🚀 **[${repo}]** ¡**${pusher}** realizó un push de **${commitsCount}** commit(s)!\n🔗 **Ver cambios:** ${compareUrl}`;
    }

    if (event === 'issues') {
        const action = body.action;
        const issueTitle = body.issue?.title;
        const issueUrl = body.issue?.html_url;
        const user = body.issue?.user?.login;
        const repo = body.repository?.full_name;

        discordMessage = `📌 **[${repo}] Issue ${action}** por @${user}\n**Título:** ${issueTitle}\n🔗 **Link:** ${issueUrl}`;
    }

    if (discordMessage) {
        try {
            await axios.post(DISCORD_WEBHOOK_URL, {
                content: discordMessage,
            });
            return res.status(200).json({ message: 'Notificación enviada con éxito a Discord.' });
        } catch (error) {
            console.error('Error al enviar la petición a Discord:', error?.response?.data || error.message);
            return res.status(500).json({ error: 'Fallo al enviar la notificación a Discord.' });
        }
    }

    return res.status(200).json({ message: `Evento '${event}' recibido pero sin acción configurada.` });
};