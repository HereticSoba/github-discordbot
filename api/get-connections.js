const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido.' });
    }

    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: 'El parámetro user_id es requerido.' });
    }

    try {
        const { data, error } = await supabase
            .from('connections')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error al obtener conexiones de Supabase:', error.message);
            return res.status(500).json({ error: 'Error al consultar la base de datos.' });
        }

        return res.status(200).json({ connections: data });
    } catch (err) {
        console.error('Error interno:', err.message);
        return res.status(500).json({ error: 'Error del servidor al procesar la solicitud.' });
    }
}