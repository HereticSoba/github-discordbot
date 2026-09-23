const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido.' });
    }

    const { github_repo, discord_webhook_url, user_id } = req.body || {};

    if (!github_repo || !discord_webhook_url) {
        return res.status(400).json({ error: 'El repositorio y la URL del Webhook son obligatorios.' });
    }

    try {
        const { data, error } = await supabase
            .from('connections')
            .upsert(
                {
                    github_repo: github_repo,
                    discord_webhook_url: discord_webhook_url,
                    user_id: user_id || 'Anon'
                },
                { onConflict: 'github_repo' }
            );

        if (error) {
            console.error('Error insertando en Supabase:', error.message);
            return res.status(500).json({ error: 'No se puedo guardar la conexión en la base de datos.' });
        }

        return res.status(200).json({ message: 'Conexión vinculada correctamente.' });
    } catch (err) {
        console.error('Error interno:', err.message);
        return res.status(500).json({ error: 'Error del servidor al procesar la solicitud.' });
    }
};