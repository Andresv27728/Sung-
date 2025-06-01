const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const limit = 108; // MB límite para mandar como documento

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🌴 Ingresa el nombre o enlace de un video.');

  await m.react('⏳');

  const apis = [
    { name: 'Akuari', url: q => `https://api.akuari.my.id/downloader/youtube?link=${encodeURIComponent(q)}` },
    { name: 'Botcahx', url: q => `https://api.botcahx.eu.org/api/download/youtube?url=${encodeURIComponent(q)}&apikey=admin` },
    { name: 'Aemt', url: q => `https://aemt.me/ytdl?url=${encodeURIComponent(q)}` },
    { name: 'VihangaYT', url: q => `https://vihangayt.me/download/ytmp4?q=${encodeURIComponent(q)}` },
    { name: 'Tiochat', url: q => `https://yt.tiochat.net/mp4?url=${encodeURIComponent(q)}` },
    { name: 'Zenkey', url: q => `https://zenkey.cloud/api/button/mp4?url=${encodeURIComponent(q)}` },
    { name: 'Oceansaver', url: q => `https://oceansaver.xyz/api/ytmp4?q=${encodeURIComponent(q)}` },
    { name: 'Jiosav', url: q => `https://jiosav.net/api/ytmp4?url=${encodeURIComponent(q)}` },
    { name: 'Y2mateDL', url: q => `https://y2mate.dl-api.repl.co/api?url=${encodeURIComponent(q)}` },
    { name: 'Dlfile', url: q => `https://dlfileapi.vercel.app/api/ytdl?url=${encodeURIComponent(q)}` },
  ];

  let data = null, source = null;

  for (let api of apis) {
    try {
      const res = await fetch(api.url(text));
      const json = await res.json();
      const url = json?.data?.dl_url || json?.result?.url || json?.url;
      if (url) {
        data = json;
        source = api.name;
        break;
      }
    } catch (e) {
      continue;
    }
  }

  if (!data) return m.reply("❌ Todas las fuentes fallaron. Intenta con otro video o más corto.");

  const videoUrl = data?.data?.dl_url || data?.result?.url || data?.url;
  const title = data?.title || data?.result?.title || data?.data?.title || "Video";
  const size = parseFloat(data?.size || data?.result?.size || data?.data?.size_mb || 0);
  const isBig = size >= limit;

  const caption = `
🎬 *Título:* ${title}
📦 *Tamaño:* ${isBig ? `> ${limit}MB (enviado como documento)` : `${size}MB`}
🌐 *Fuente:* ${source}
🔗 *URL:* ${text.includes("http") ? text : videoUrl}
`.trim();

  await conn.sendMessage(m.chat, {
    video: { url: videoUrl },
    caption,
    mimetype: 'video/mp4',
    fileName: title + ".mp4",
    ...(isBig ? { document: true } : {})
  }, { quoted: m });

  await m.react("✅");
};

handler.command = ["pla"];
handler.help = ["pla2"];
handler.tags = ["dl"];

export default handler;
