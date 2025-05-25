
let handler = async (m, { conn }) => {
    const fs = require('fs');
    const agendaFile = './src/database/agenda.json';

    try {
        if (!fs.existsSync(agendaFile)) {
            return conn.reply(m.chat, '📅 No hay eventos agendados.', m);
        }

        let eventos = JSON.parse(fs.readFileSync(agendaFile));
        
        // Filtrar eventos futuros y ordenar por fecha
        eventos = eventos
            .filter(e => new Date(e.fecha) > new Date())
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        if (eventos.length === 0) {
            return conn.reply(m.chat, '📅 No hay eventos próximos.', m);
        }

        let mensaje = '📅 *EVENTOS AGENDADOS*\n\n';
        
        eventos.forEach((evento, index) => {
            let fecha = new Date(evento.fecha);
            let fechaFormateada = fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            mensaje += `${index + 1}. *${evento.evento}*\n` +
                      `📅 Fecha: ${fechaFormateada}\n` +
                      `📝 Descripción: ${evento.descripcion}\n` +
                      `🆔 ID: ${evento.id}\n\n`;
        });

        conn.reply(m.chat, mensaje.trim(), m);

    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Error al mostrar la agenda.', m);
    }
};

handler.help = ['veragenda'];
handler.tags = ['agenda'];
handler.command = ['veragenda', 'eventos', 'agenda'];
handler.register = true;

export default handler;
