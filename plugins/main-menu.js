
let handler = async (m, { conn, args, usedPrefix, command }) => {
  let userId = m.mentionedJid?.[0] || m.sender
  let user = global.db.data.users[userId]
  let name = conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length

  // Obtener hora y saludo
  let hour = new Intl.DateTimeFormat('es-PE', {
    hour: 'numeric',
    hour12: false,
    timeZone: 'America/Lima'
  }).format(new Date())
  
  let saludo = hour < 6 ? "🌌 Buenas madrugadas" :
               hour < 12 ? "🌅 Buenos días" :
               hour < 18 ? "🌄 Buenas tardes" :
               "🌃 Buenas noches"

  // Información del usuario
  let userInfo = `
╔═══「 INFORMACIÓN DEL USUARIO 」═══╗
║ 👤 *Nombre:* ${name}
║ 🎖️ *Nivel:* ${user.level}
║ ⭐ *Experiencia:* ${user.exp}
║ 💎 *Diamantes:* ${user.diamond}
║ 🪙 *Monedas:* ${user.coin}
║ 🏦 *Banco:* ${user.bank}
║ 💖 *Salud:* ${user.health}
║ 👑 *Rango:* ${user.role}
║ 🎯 *Registrado:* ${user.registered ? '✅ Sí' : '❌ No'}
║ 💎 *Premium:* ${user.premium ? '✅ Sí' : '❌ No'}
╚════════════════════════════════╝`

  // Agrupar comandos por categorías
  let categories = {}
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.help || !plugin.tags) continue
    for (let tag of plugin.tags) {
      if (!categories[tag]) categories[tag] = []
      categories[tag].push(...plugin.help.map(cmd => `${usedPrefix}${cmd}`))
    }
  }

  // Función para obtener emoji de categoría
  const getCategoryEmoji = (tag) => {
    const emojis = {
      'main': '🏠',
      'info': 'ℹ️',
      'ai': '🤖',
      'anime': '🎌',
      'owner': '👑',
      'grupo': '👥',
      'grupo-admin': '🛡️',
      'descargas': '📥',
      'tools': '🔧',
      'fun': '🎮',
      'game': '🎯',
      'rpg': '⚔️',
      'sticker': '🏷️',
      'audio': '🎵',
      'imagen': '🖼️',
      'maker': '🎨',
      'convertidor': '🔄',
      'nsfw': '🔞',
      'premium': '💎',
      'jadibot': '🤖',
      'config': '⚙️'
    }
    return emojis[tag] || '📂'
  }

  // Crear menú principal
  let menuText = `
╔═════『 Sung Jin-Woo System 』═════╗
║                                                    
║ ${saludo}, ${name}
║                                                    
║ 🤖 *Bot:* ${botname}
║ ⏱️ *Actividad:* ${uptime}
║ 👥 *Usuarios:* ${totalreg}
║ ✅ *Registrados:* ${rtotalreg}
║ 📅 *Fecha:* ${new Date().toLocaleDateString('es-PE')}
║ 🕐 *Hora:* ${hour}:${new Date().getMinutes()}
║                                                    
║ 『 Creado por YoSoyYo 』
║                                                    
╚════════════════════════════════╝

${userInfo}
`

  // Categorías ordenadas
  const orderedCategories = [
    'main', 'info', 'ai', 'anime', 'descargas', 'tools', 
    'fun', 'game', 'rpg', 'sticker', 'audio', 'imagen', 
    'maker', 'convertidor', 'grupo', 'grupo-admin', 
    'owner', 'premium', 'jadibot', 'config'
  ]

  // Agregar comandos por categorías
  for (let tag of orderedCategories) {
    if (categories[tag] && categories[tag].length > 0) {
      let tagName = tag.toUpperCase().replace(/-/g, ' ')
      let emoji = getCategoryEmoji(tag)
      
      menuText += `

╔═══ ${emoji} ${tagName} ═══╗`
      
      // Organizar comandos en columnas
      let cmds = categories[tag].sort()
      for (let i = 0; i < cmds.length; i += 2) {
        let cmd1 = cmds[i] || ''
        let cmd2 = cmds[i + 1] || ''
        
        if (cmd2) {
          menuText += `\n║ ⇝ ${cmd1.padEnd(20)} ⇝ ${cmd2}`
        } else {
          menuText += `\n║ ⇝ ${cmd1}`
        }
      }
      
      menuText += `\n╚════════════════════════════════╝`
    }
  }

  // Agregar categorías restantes que no estén en la lista ordenada
  for (let [tag, cmds] of Object.entries(categories)) {
    if (!orderedCategories.includes(tag) && cmds.length > 0) {
      let tagName = tag.toUpperCase().replace(/-/g, ' ')
      let emoji = getCategoryEmoji(tag)
      
      menuText += `

╔═══ ${emoji} ${tagName} ═══╗`
      
      let sortedCmds = cmds.sort()
      for (let i = 0; i < sortedCmds.length; i += 2) {
        let cmd1 = sortedCmds[i] || ''
        let cmd2 = sortedCmds[i + 1] || ''
        
        if (cmd2) {
          menuText += `\n║ ⇝ ${cmd1.padEnd(20)} ⇝ ${cmd2}`
        } else {
          menuText += `\n║ ⇝ ${cmd1}`
        }
      }
      
      menuText += `\n╚════════════════════════════════╝`
    }
  }

  // Footer
  menuText += `

╔════════════════════════════════╗
║ 💡 *Tip:* Usa ${usedPrefix}help <comando>
║    para obtener información específica
║                                                    
║ 🔗 *Enlaces importantes:*
║ • Canal: ${redes}
║ • Soporte: Contacta al owner
║                                                    
║ ⚠️ *Nota:* Algunos comandos requieren
║    registro o permisos especiales
╚════════════════════════════════╝`

  // Enviar menú completo
  await conn.sendMessage(m.chat, {
    video: { url: 'https://files.catbox.moe/i74z9e.mp4' },
    caption: menuText.trim(),
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
        title: `${botname} - Menú Principal`,
        body: `${categories ? Object.keys(categories).length : 0} categorías disponibles`,
        thumbnailUrl: 'https://files.catbox.moe/ydal8w.mp4',
        sourceUrl: redes,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true,
      }
    }
  }, { quoted: m })
}

// Función para convertir tiempo
function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

handler.help = ['menu', 'help', 'comandos']
handler.tags = ['main']
handler.command = ['menu', 'help', 'comandos', 'allmenu']
handler.register = true

export default handler
