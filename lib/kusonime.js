const axios = require("axios")
const cheerio = require("cheerio")

const kusonimeSearch = async (query) => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url: "https://kusonime.com/?s=" + query,
        method: "GET",
        headers: {
          "user-agent": "Mozilla/5.0 (Linux; Android 10; RMX2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36",
      },
    }).then(({data}) => {
      const $ = cheerio.load(data)
      const res = $('div[class="content"]').map(function () {
        return {
          title: $(this).find('h2 > a').attr("title"),
          release: $(this).find('p:contains("Released")').text().trim(),
          genre: $(this).find('p:contains("Genre") > a').map((_, element) => $(element).text()).get(),
          url: $(this).find('h2 > a').attr("href"),
        }
      }).toArray()
     resolve(res)
    })
  })
}

const kusonimeDetail = async (url) => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url,
        method: "GET",
        headers: {
          "user-agent": "Mozilla/5.0 (Linux; Android 10; RMX2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36",
      },
    }).then(({data}) => {
      const $ = cheerio.load(data)
      const rootContent = $('div[class="venser"]');
      const rootBody = rootContent.find('div[class="lexot"]');
      const rootInfo = rootBody.children('div[class="info"]');
    
      let judul = $('div[class="post-thumb"] > h1[class="jdlz"]').text();
      let japanese = $('div[class="info"] > p:nth-child(1)').text()
      let genre = $('div[class="info"] > p:nth-child(2)').text();
      let season = $('div[class="info"] > p:nth-child(3)').text()
      let totaleps = $('div[class="info"] > p:nth-child(7)').text();
      let score = $('div[class="info"] > p:nth-child(8)').text();
      let durasi = $('div[class="info"] > p:nth-child(9)').text();
      let tglrilis = $('div[class="info"] > p:nth-child(10)').text();
      let type = $(rootInfo.children("p").get(4)).text().split(":")[1].trim();
      let rate = $(rootInfo.children("p").get(7)).text().split(":")[1].trim();
      let status = $(rootInfo.children("p").get(5)).text().split(":")[1].trim();
      let desk = $('div[class="venser"]').find('div[class="lexot"]').children("p").first().text();
      let producer = $(rootInfo.children("p").get(3)).text().split(":")[1].trim();
      
      linkk = {}    
      $('.smokeurlrh').each((index, element) => {
      	const format = $(element).find('strong').text().trim();
      	const links = $(element).find('a[href]').map((i, link) => $(link).attr('href')).get();     	
      	linkk[format] = links; 
       });

      const result = {
        judul,
        japanese, 
        genre,
        season,
        producer,
        type,
        status,
        totaleps: totaleps.split(": ")[1],
        score,
        durasi,
        rilis: tglrilis.split(": ")[1],
        image: $('div[class="post-thumb"] > img').attr("src"),
        desk,
        download: linkk
      }
      resolve(result)
    })
  })
}

module.exports = { 
  kusonimeSearch,
  kusonimeDetail
}
