const handler = async (m, { conn, usedPrefix, command, args, isOwner }) => {
  const settings = global.db.data.settings[conn.user.jid] || {};
  let isEnable = settings.autoread || false;

  if (args[0] === 'on' || args[0] === 'enable') {
    isEnable = true;
  } else if (args[0] === 'off' || args[0] === 'disable') {
    isEnable = false;
  } else {
    const estado = isEnable ? '✓ Activado' : '✗ Desactivado';
    return conn.reply(m.chat, `≡  AUTO-READ\n\nEstado actual: *${estado}*\n\n• Para activar:\n*${usedPrefix}${command} on*\n• Para desactivar:\n*${usedPrefix}${command} off*`, m);
  }

  if (!isOwner) {
    global.dfail('rowner', m, conn);
    return;
  }

  settings.autoread = isEnable;
  global.db.data.settings[conn.user.jid] = settings;

  conn.reply(m.chat, `✔ Auto-read fue *${isEnable ? 'activado' : 'desactivado'}*.`, m);
};

handler.help = ['autoread [on|off]'];
handler.tags = ['owner'];
handler.command = ['autoread'];
handler.rowner = true;

export default handler;
