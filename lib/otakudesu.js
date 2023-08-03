const axios = require("axios");
const cheerio = require("cheerio")

const otakudesuSearch = async(title) => {
  return new Promise((resolve, reject) => {
  const query = encodeURIComponent(title)
  axios
    .request({
      url: "https://otakudesu.lol/?s="+query+"&post_type=anime",
      method: "GET",
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10; RMX2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36",
      }
    }).then(({data}) => {
      const $ = cheerio.load(data) 
      let search = []
        $('#venkonten > div > div.venser > div > div > ul > li').each(function (a, b) {
        search.push($(b).find('h2 > a').attr('href'))
      })
      let hasil = [];
      search.forEach(function (url) {
      axios({
        url,
        method: 'GET',
        headers: {
          "user-agent": "Mozilla/5.0 (Linux; Android 10; RMX2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36"
        }
      }).then(({ data }) => {
        let $ = cheerio.load(data)
        let link_eps = []
          $('#venkonten > div.venser > div.episodelist > ul > li').each(function (a, b) {
            link_eps.push({ episode: $(b).find('span > a').text(), upload_at: $(b).find('span.zeebr').text(), link: $(b).find('span > a').attr('href') })
          })
        hasil.push({
          title: { 
            indonesia: $('#venkonten > div.venser > div.jdlrx > h1').text(),
            synonym: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(1) > span').text().replace('Judul: ', ''),
            japanese: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(2) > span').text().replace('Japanese: ', '')
          },
          score: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(3) > span').text().replace('Skor: ', ''),
          producer: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(4) > span').text().replace('Produser: ', ''),
          type: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(5) > span').text().replace('Tipe: ', ''),
          status: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(6) > span').text().replace('Status: ', ''),
          total_eps: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(7) > span').text().replace('Total Episode: ', ''),
          duration: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(8) > span').text().replace('Durasi: ', ''),
          release: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(9) > span').text().replace('Tanggal Rilis: ', ''),
          studio: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(10) > span').text().replace('Studio: ', ''),
          genre: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(11) > span').text().replace('Genre: ', ''),
          synopsis: $('#venkonten > div.venser > div.fotoanime > div.sinopc > p').text(),
          link_eps: link_eps
        })
        resolve(hasil)
      })
    })
  })
})
}

const otakudesuDetail = async(url) => {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: 'GET',
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10; RMX2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36"
      }
    }).then(({ data }) => {
      let $ = cheerio.load(data)
      let link_eps = []
        $('#venkonten > div.venser > div.episodelist > ul > li').each(function (a, b) {
          link_eps.push({ episode: $(b).find('span > a').text(), upload_at: $(b).find('span.zeebr').text(), link: $(b).find('span > a').attr('href') })
        })
      let hasil = {
        title: { 
          indonesia: $('#venkonten > div.venser > div.jdlrx > h1').text(),
          anonym: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(1) > span').text().replace('Judul: ', ''),
          japanese: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(2) > span').text().replace('Japanese: ', '')
        },
        score: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(3) > span').text().replace('Skor: ', ''),
        producer: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(4) > span').text().replace('Produser: ', ''),
        type: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(5) > span').text().replace('Tipe: ', ''),
        status: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(6) > span').text().replace('Status: ', ''),
        total_eps: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(7) > span').text().replace('Total Episode: ', ''),
        duration: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(8) > span').text().replace('Durasi: ', ''),
        release: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(9) > span').text().replace('Tanggal Rilis: ', ''), 
        studio: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(10) > span').text().replace('Studio: ', ''),
        genre: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(11) > span').text().replace('Genre: ', ''),
        synopsis: $('#venkonten > div.venser > div.fotoanime > div.sinopc > p').text(),
        link_eps: link_eps
      }
      resolve(hasil)
    })
  })
}

const otakudesuDownload = async(url) => {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: 'GET',
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10; RMX2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36"
      }
    }).then(({ data }) => {
      let $ = cheerio.load(data)
      let mp4 = []
        $('#venkonten > div.venser > div.venutama > div.download > ul:nth-child(2) > li').each(function (a, b) {
          $(b).find('a').each(function (c, d) {
            mp4.push({ resolusi: $(b).find('strong').text(), size: $(b).find('i').text(), type: $(d).text(), link: $(d).attr('href') })
          })
        })
      let mkv = []
        $('#venkonten > div.venser > div.venutama > div.download > ul:nth-child(3) > li').each(function (a, b) {
          $(b).find('a').each(function (c, d) {
            mkv.push({ resolusi: $(b).find('strong').text(), size: $(b).find('i').text(), type: $(d).text(), link: $(d).attr('href') })
          })
        })
      let hasil = {
        title: $('#venkonten > div.venser > div.venutama > h1').text(),
        post: $('#venkonten > div.venser > div.venutama > div.kategoz > span:nth-child(2)').text().replace('Posted by ', ''),
        release: $('#venkonten > div.venser > div.venutama > div.kategoz > span:nth-child(4)').text().replace('Release on ', ''),
        credit: $('#venkonten > div.venser > div.cukder > div.infozin > div > p:nth-child(1)').text().replace('Credit: ', ''),
        encoder: $('#venkonten > div.venser > div.cukder > div.infozin > div > p:nth-child(2)').text().replace('Encoder: ', ''),
        genres: $('#venkonten > div.venser > div.cukder > div.infozin > div > p:nth-child(3)').text().replace('Genres: ', ''),
        duration: $('#venkonten > div.venser > div.cukder > div.infozin > div > p:nth-child(4)').text().replace('Duration: ', ''),
        type: $('#venkonten > div.venser > div.cukder > div.infozin > div > p:nth-child(5)').text().replace('Tipe: ', ''),
        image: $('#venkonten > div.venser > div.cukder > img').attr('src'),
        link_mp4: mp4,
        link_mkv: mkv
      }
    resolve(hasil)
    })
  })
}

module.expots = {
  otakudesuSearch,
  otakudesuDetail,
  otakudesuDownload
}