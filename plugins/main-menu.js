// ♥ 𝙼𝚎𝚗𝚞 𝚍𝚎 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 ♥
// ᵁˢᵃ ᵉˢᵗᵉ ᶜᵒᵈⁱᵍᵒ ˢⁱᵉᵐᵖʳᵉ ᶜᵒⁿ ᶜʳᵉᵈⁱᵗᵒˢ

let handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid?.[0] || m.sender
  let user = global.db.data.users[userId]
  let name = conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length

  // Saludo decorado
  let hour = new Intl.DateTimeFormat('es-PE', {
  hour: 'numeric',
  hour12: false,
  timeZone: 'America/Lima'
}).format(new Date())
  
  let saludo = hour < 6 ? "🌌 Buenas madrugadas, espíritu insomne..." :
               hour < 12 ? "🌅 Buenos días, alma luminosa~" :
               hour < 18 ? "🌄 Buenas tardes, viajero astral~" :
               "🌃 Buenas noches, sombra errante~"

  // Agrupar comandos por categorías
  let categories = {}
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.help || !plugin.tags) continue
    for (let tag of plugin.tags) {
      if (!categories[tag]) categories[tag] = []
      categories[tag].push(...plugin.help.map(cmd => `#${cmd}`))
    }
  }

  // Emojis random por categoría
  let decoEmojis = ['✨', '🌸', '👻', '⭐', '🔮', '💫', '☁️', '🦋', '🪄']
  let emojiRandom = () => decoEmojis[Math.floor(Math.random() * decoEmojis.length)]

  // MENÚ HANAKO-KUN STYLE
  let menuText = `
╔═════『 Sung Jin-Woo System 』═════╗

» Sistema operativo: Multi-Device
» Usuario vinculado: @${userId.split('@')[0]}
» Tiempo en línea: ${uptime}
» Espíritus registrados: ${totalreg}
» Hora actual: ${hour}

Este bot fue invocado por *YoSoyYo*
Resultados. No promesas.

╚══════════════════════════════════╝
`.trim()

for (let [tag, cmds] of Object.entries(categories)) {
  let tagName = tag.toUpperCase().replace(/_/g, ' ')
  menuText += `

╔═══ ${tagName} ═══╗
${cmds.map(cmd => `║ ⇝ ${cmd}`).join('\n')}
╚═════════════════╝`
}

  // Mensaje previo cute
  await conn.reply(m.chat, '⌜ ⊹ Esperame idiota... ⊹ ⌟', m, {
    contextInfo: {
      externalAdReply: {
        title: botname,
        body: "Que miras idiota",
        thumbnailUrl: 'https://files.catbox.moe/ydal8w.mp4',
        sourceUrl: redes,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true,
      }
    }
  })

  // Enviar menú con video estilo gif
  await conn.sendMessage(m.chat, {
    video: { url: 'https://files.catbox.moe/i74z9e.mp4', gifPlayback: true },
    caption: menuText,
    gifPlayback: true,
    contextInfo: {
      mentionedJid: [m.sender, userId],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363372883715167@newsletter',
        newsletterName: 'SoyMaycol',
        serverMessageId: -1,
      },
      forwardingScore: 999,
      externalAdReply: {
        title: botname,
        body: "Que quieres",
        thumbnailUrl: banner,
        sourceUrl: redes,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true,
      },
    }
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `${h}h ${m}m ${s}s`
}
