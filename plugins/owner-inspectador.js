let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) return m.reply(`『✦』Uso correcto:\n*${usedPrefix + command} <link del canal>*`)

  const regex = /https?:\/\/whatsapp\.com\/channel\/([\w\d]+)/i
  const match = text.match(regex)
  if (!match) return m.reply('『✦』Enlace inválido. Asegúrate de que sea un link de canal.')

  const inviteCode = match[1]
  const jid = `${inviteCode}@newsletter`

  m.reply(`╭─「 *Inspección de Canal* 」
│ ✦ *Código:* ${inviteCode}
│ ✎ *JID correcto:* ${jid}
╰───────────────`)
}

handler.help = ['inspeccionar <link>']
handler.tags = ['tools']
handler.command = ['inspeccionar', 'channelid']

export default handler
