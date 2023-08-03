const spotapi = require('spotify-finder')

class Spotify {
  search = async (query) => {
    return new Promise(async (resolve, reject) => {
      const spotsearch = new spotapi({
        consumer: {
          key: '271f6e790fb943cdb34679a4adcc34cc',
          secret: 'c009525564304209b7d8b705c28fd294'
        }
      })
      const res = await spotsearch.search({ q: query })
      resolve(res)
    })
  }
  download = async (url) => {
    return new Promise(async (resolve, reject) => {
    const Spotify = require("spotifydl-core").default;	
    const client = new Spotify({
      clientId: "acc6302297e040aeb6e4ac1fbdfd62c3",
      clientSecret: "0e8439a1280a43aba9a5bc0a16f3f009",
    });
    let hasil = {};
      hasil = await client.getTrack(url);
      hasil.mp3 = await client.downloadTrack(url);
      resolve(hasil);
    });
  }
} 
  
module.exports = {
	Spotify 
}