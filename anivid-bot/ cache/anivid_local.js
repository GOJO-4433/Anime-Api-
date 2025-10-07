const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
  config: { name: "anivid", shortDescription: "Local Anime video", category: "fun" },

  onStart: async function ({ api, event, message }) {
    try {
      const jsonPath = path.join(__dirname, 'anime.json');
      if (!fs.existsSync(jsonPath)) return message.reply('❌ anime.json ফাইল নেই।');

      const raw = fs.readFileSync(jsonPath, 'utf8');
      const data = JSON.parse(raw);
      const posts = data.posts;
      if (!Array.isArray(posts) || posts.length === 0) return message.reply('❌ API ডাটা খালি বা ভুল ফরম্যাট।');

      const group = posts[Math.floor(Math.random() * posts.length)];
      const videoUrl = Array.isArray(group) ? group[Math.floor(Math.random() * group.length)] : null;

      if (!videoUrl) return message.reply('❌ ভিডিও URL পাওয়া যায়নি।');

      // Temporary download
      const tempPath = path.join(__dirname, 'cache', `${Date.now()}.mp4`);
      if (!fs.existsSync(path.join(__dirname, 'cache'))) fs.mkdirSync(path.join(__dirname, 'cache'));

      const videoResp = await axios.get(videoUrl, { responseType: 'stream', timeout: 20000 });
      const writer = fs.createWriteStream(tempPath);
      videoResp.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
        videoResp.data.on('error', reject);
      });

      const stream = fs.createReadStream(tempPath);
      await message.reply({ body: '🎬 Random Anime Video', attachment: stream });

      try { fs.unlinkSync(tempPath); } catch (e) {}
    } catch (e) {
      console.error(e);
      return message.reply('❌ কিছু ভুল হয়েছে।');
    }
  }
};
