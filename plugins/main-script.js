const handler = async (m, { conn }) => {
  const texto = `
⚔️ _*SUNG JIM WO*_ ⚔️

\`\`\`Repositorio OFC:\`\`\`
*no hay, no existe, no lo crearon*

> no tu estrellita ayudaría mucho xd

🔗 *Comunidad Oficial:* https://whatsapp.com/channel/0029Vb5atcVL7UVQwAB9tU2k
  `.trim()

  await conn.reply(m.chat, texto, m)
}

handler.help = ['script']
handler.tags = ['info']
handler.command = ['script']

export default handler
