import fs from 'fs';
import path from 'path';

const agendaFile = './src/database/agenda.json';

// Asegurar que el archivo de agenda existe
if (!fs.existsSync(agendaFile)) {
    fs.writeFileSync(agendaFile, JSON.stringify([], null, 2));
}

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `❌ Formato incorrecto. Uso correcto:\n\n*${usedPrefix + command}* <evento> | <fecha> | <hora> | <descripción>\n\nEjemplos:\n${usedPrefix + command} reunión | mañana | 15:00 | Reunión de trabajo\n${usedPrefix + command} cita | 31/07/2025 | 14:30 | Cita médica`, m);

    let [evento, fecha, hora, descripcion] = text.split('|').map(item => item.trim());
    
    if (!evento || !fecha || !hora) return conn.reply(m.chat, `❌ Faltan datos. Necesito el evento, fecha y hora.`, m);
    
    try {
        // Procesar fecha
        let fechaEvento;
        if (fecha.toLowerCase() === 'mañana') {
            fechaEvento = new Date();
            fechaEvento.setDate(fechaEvento.getDate() + 1);
        } else if (fecha.toLowerCase() === 'hoy') {
            fechaEvento = new Date();
        } else {
            // Formato esperado: DD/MM/YYYY
            let [dia, mes, año] = fecha.split('/');
            fechaEvento = new Date(año, mes - 1, dia);
        }

        // Validar hora (formato HH:MM)
        if (!/^\d{2}:\d{2}$/.test(hora)) {
            return conn.reply(m.chat, `❌ Formato de hora inválido. Use HH:MM (ejemplo: 15:30)`, m);
        }

        // Combinar fecha y hora
        let [horaNum, minutos] = hora.split(':');
        fechaEvento.setHours(parseInt(horaNum), parseInt(minutos));

        if (fechaEvento < new Date()) {
            return conn.reply(m.chat, `❌ No puedes agendar eventos en el pasado.`, m);
        }

        // Cargar eventos existentes
        let eventos = JSON.parse(fs.readFileSync(agendaFile));

        // Agregar nuevo evento
        let nuevoEvento = {
            id: Date.now().toString(),
            evento,
            fecha: fechaEvento.toISOString(),
            descripcion: descripcion || 'Sin descripción',
            creador: m.sender,
            chat: m.chat
        };

        eventos.push(nuevoEvento);

        // Guardar eventos actualizados
        fs.writeFileSync(agendaFile, JSON.stringify(eventos, null, 2));

        // Formatear fecha para mostrar
        let fechaFormateada = fechaEvento.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let mensaje = `✅ *Evento Agendado*\n\n` +
                     `📌 *Evento:* ${evento}\n` +
                     `📅 *Fecha:* ${fechaFormateada}\n` +
                     `📝 *Descripción:* ${descripcion || 'Sin descripción'}\n\n` +
                     `ID del evento: ${nuevoEvento.id}`;

        conn.reply(m.chat, mensaje, m);

    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `❌ Error al agendar el evento. Verifique el formato de fecha y hora.`, m);
    }
};

handler.help = ['agendar <evento | fecha | hora | descripción>'];
handler.tags = ['agenda'];
handler.command = ['agendar', 'programar', 'agenda'];
handler.register = true;

export default handler;
