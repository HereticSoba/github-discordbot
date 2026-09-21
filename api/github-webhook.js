const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Configurado para peticiones POST.' });
    }

    const event = req.headers['x-github-event'];
    const body = req.body || {};

    if (event === 'ping') {
        return res.status(200).json({ message: 'Conexión exitosa con GitHub Webhook.' });
    }

    const repoFullName = body.repository?.full_name;

    if (!repoFullName) {
        return res.status(400).json({ error: 'No se identificó el repositorio en el payload.' });
    }

    const { data: connection, error } = await supabase
        .from('connections')
        .select('discord_webhook_url')
        .eq('github_repo', repoFullName)
        .single();

    if (error || !connection) {
        console.error('No se encontró conexión en BD para el repositorio: ${repoFullName}');
        return res.status(400).json({ error: 'Repositorio no registrado en el sistema.' });
    }

    const DISCORD_WEBHOOK_URL = connection.discord_webhook_url;
    let discordMessage = '';

    /* Pushes */
    if (event === 'push') {
        const pusher = body.pusher?.name || 'Alguien';
        const commitsCount = body.commits?.length || 0;
        const compareUrl = body.compare;

        discordMessage = `🚀 **[${repoFullName}]** ¡**${pusher}** realizó un push de **${commitsCount}** commit(s)!\n🔗 **Ver cambios:** ${compareUrl}`;
    }

    /* Issues */
    if (event === 'issues') {
        const action = body.action;
        const issueTitle = body.issue?.title;
        const issueUrl = body.issue?.html_url;
        const user = body.issue?.user?.login;

        discordMessage = `📌 **[${repoFullName}] Issue ${action}** por @${user}\n**Título:** ${issueTitle}\n🔗 **Link:** ${issueUrl}`;
    }


    /* Confirmación a Discord */
    if (discordMessage) {
        try {
            await axios.post(DISCORD_WEBHOOK_URL, { content: discordMessage, });
            return res.status(200).json({ message: 'Notificación enviada a Discord.' });
        } catch (error) {
            console.error('Error al enviar a Discord:', error?.response?.data || error.message);
            return res.status(500).json({ error: 'Fallo al notificar a Discord.' });
        }
    }

    return res.status(200).json({ message: `Evento '${event}' recibido pero sin acción.` });
};