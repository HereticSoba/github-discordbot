module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido.' });
    }

    const { discord_webhook_url, github_repo } = req.body || {};
    if (!discord_webhook_url) {
        return res.status(400).json({ error: 'Falta la URL del Webhook de Discord.' });
    }

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'github-discordbot.vercel.app';
    const logoUrl = `${protocol}://${host}/logo.png`;

    try {
        const discordPayload = {
            username: 'GitCord Bot',
            avatar_url: logoUrl,
            embeds: [{
                title: '¡Prueba de conexión exitosa!',
                description: `¡Tu integración con **${github_repo || 'tu repositorio'}** está operativo!`,
                color: 5814783,
                thumbnail: {
                    url: logoUrl
                },
                fields: [
                    { name: 'Estado', value: '✅ Webhook activo', inline: true },
                    { name: 'Plataforma', value: 'GitCord', inline: true }
                ],
                footer: {
                    text: 'GitCord - Notificación de prueba',
                    icon_url: logoUrl
                },
                timestamp: new Date().toISOString()
            }]
        };

        const response = await fetch(discord_webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload)
        });

        if (response.ok || response.status === 204) {
            return res.status(200).json({ message: 'Mensaje de prueba enviado a Discord.' });
        } else {
            return res.status(400).json({ error: 'No se pudo enviar el mensaje a Discord. Verificar la URL del Webhook.' });
        }
    } catch (err) {
        console.error('Error al probar webhook:', err.message);
        return res.status(500).json({ error: 'Error del servido ral conectar con Discord.' });
    }
};