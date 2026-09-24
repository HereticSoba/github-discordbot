const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    if(req.method !== 'DELETE'){
        return res.status(405).json({error: 'Método no permitido.'});
    }
    const { id, user_id} = req.body || {};

    if(!id || !user_id){
        return res.status(400).json({error: 'Faltan parámetros obligatorios (id, user_id'});
    }

    try {
        const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id);

        if(error){
            console.error('Error eliminando conexión de Supabase:', error.message);
            return res.status(500).json({error: 'No se pudo eliminar la conexión.'});
        }

        return res.status(200).json({message:'Conexión eliminada correctamente.'});
    }catch(err){
        console.error('Error interno:', err.message);
        return res.status(500).json({error: 'Error del servidor al procesar la solicitud.'});
    }
}