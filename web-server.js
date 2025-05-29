
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Almacenamiento en memoria para los clics (en producción usar base de datos)
let clickData = {};
let botStats = {
    startTime: Date.now(),
    totalUsers: 0,
    totalCommands: 0,
    isOnline: true
};

// Función para obtener estadísticas del bot
function getBotStats() {
    try {
        // Leer datos de la base de datos del bot
        const dbPath = './src/database/database.json';
        if (fs.existsSync(dbPath)) {
            const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            botStats.totalUsers = Object.keys(dbData.users || {}).length;
        }
        
        // Calcular tiempo activo
        const uptimeMs = Date.now() - botStats.startTime;
        const uptimeDays = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
        const uptimeHours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const uptimeMinutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
        
        return {
            ...botStats,
            uptime: `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m`,
            uptimeMs
        };
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return botStats;
    }
}

// Rutas API
app.get('/api/stats', (req, res) => {
    res.json(getBotStats());
});

app.post('/api/click', (req, res) => {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
        return res.status(400).json({ error: 'Número de teléfono inválido' });
    }
    
    if (!clickData[phoneNumber]) {
        clickData[phoneNumber] = { clicks: 0, lastClick: Date.now() };
    }
    
    clickData[phoneNumber].clicks++;
    clickData[phoneNumber].lastClick = Date.now();
    
    res.json({ 
        clicks: clickData[phoneNumber].clicks,
        message: 'Click registrado exitosamente'
    });
});

app.post('/api/redeem', async (req, res) => {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
        return res.status(400).json({ error: 'Número de teléfono inválido' });
    }
    
    if (!clickData[phoneNumber] || clickData[phoneNumber].clicks === 0) {
        return res.status(400).json({ error: 'No tienes clics para canjear' });
    }
    
    const clicks = clickData[phoneNumber].clicks;
    const premiumMinutes = clicks;
    
    try {
        // Enviar mensaje al bot (simulado - en producción integrar con el bot real)
        console.log(`Enviando ${premiumMinutes} minutos de premium a ${phoneNumber}`);
        
        // Resetear clics
        clickData[phoneNumber].clicks = 0;
        
        res.json({ 
            success: true,
            premiumMinutes,
            message: `Se han canjeado ${premiumMinutes} minutos de premium. El bot te enviará un mensaje de confirmación.`
        });
        
        // Aquí integrarías con el bot real para enviar el mensaje
        // sendPremiumToBot(phoneNumber, premiumMinutes);
        
    } catch (error) {
        console.error('Error canjeando premium:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/clicks/:phoneNumber', (req, res) => {
    const { phoneNumber } = req.params;
    const clicks = clickData[phoneNumber]?.clicks || 0;
    res.json({ clicks });
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, HOST, () => {
    console.log(`🌐 Servidor web iniciado en http://${HOST}:${PORT}`);
    console.log(`📊 Panel de estadísticas disponible`);
    console.log(`🔗 URL externa: ${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : `http://${HOST}:${PORT}`}`);
});

export default app;
