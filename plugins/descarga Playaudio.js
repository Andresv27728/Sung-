import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`🌟 Ingresa un nombre para buscar en YouTube.\n\n✨ *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    await m.react("🕛"); // React to show processing started

    // --- PRIMER PASO: BUSCAR VIDEO ---
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      await m.react("❌");
      return m.reply(`⚠️ No encontré resultados de video en YouTube para *"${text}"*...`);
    }

    const video = searchData.data[0]; // Primer resultado

    // Nuevo waitMessage estilizado
    const waitMessage = `*┏━━━━━━༺❀༻━━━━━━┓*
*┃* ✨ *Nombre:* ${video.title}
*┃* 🧚‍♀️ *Artista:* ${video.author.name}
*┃* ⌛ *Duración:* ${video.duration}
*┃* 👁 *Vistas:* ${video.views}
*┗━━━━━━༺❀༻━━━━━━┛*

> ☁️ *Estamos preparando tu audio, espera tantito...*`;

    // Enviamos miniatura con mensaje
    const message = await conn.sendMessage(m.chat, {
      image: { url: video.image },
      caption: waitMessage.trim(),
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "☕︎︎ 𝘔𝘢𝘪 • 𝑊𝑜𝑟𝑙𝑑 𝑂𝑓 𝐶𝑢𝑡𝑒 🍁",
          body: "✐ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖡𝗒 𝖶𝗂𝗋𝗄 🌵",
          thumbnailUrl: video.image,
          mediaUrl: "https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY",
          mediaType: 2,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    // --- SEGUNDO PASO: DESCARGAR AUDIO ---
    const downloadApi = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(video.title)}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    if (!downloadData?.result?.download?.url) {
      await m.react("❌");
      if (downloadData?.result?.msg) {
        return m.reply(`❌ No se pudo obtener el audio del video usando el título. Error de la API: ${downloadData.result.msg}`);
      }
      return m.reply("❌ No se pudo obtener el audio del video.");
    }

    const audioUrl = downloadData.result.download.url;

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: false,
      fileName: `🎵 ${video.title}.mp3`,
      contextInfo: {
        forwardingScore: 9,
        isForwarded: true
      }
    }, { quoted: m });

    await m.react("✅");

  } catch (error) {
    console.error(error);
    m.reply(`❌ Ocurrió un error al procesar tu solicitud:\n${error.message}`);
    await m.react("❌");
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto>', 'playaudio <texto>'];
handler.tags = ['media'];

export default handler;
