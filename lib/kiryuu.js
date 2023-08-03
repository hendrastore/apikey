const axios = require("axios");
const cheerio = require("cheerio")

const kiryuuSearch = async (query) => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url: "https://kiryuu.id/?s=" + encodeURIComponent(query),
        method: "GET",
        headers: {
          "user-agent": "Mozilla/5.0 (Linux; Android 10; RMX2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36",
      },
    }).then(({ data }) => {
      const $ = cheerio.load(data) 
      const hasil = $("div.bs > div.bsx").map(function () {
        return { 
          title: $(this).find("a").attr("title"),
          chapter: $(this).find("a > div.bigor > div.adds > div.epxs").text().trim(), 
          ranting: $(this).find("a > div.bigor > div.adds > div.rt > div.rating > div.numscore").text().trim(), 
          url: $(this).find("a").attr("href"),
        }
      }).toArray()
    resolve(hasil)
    })
  })
}

const kiryuuDetail = async (url) => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url,
        method: "GET",
        headers: {
          "user-agent": "Mozilla/5.0 (Linux; Android 10; RMX2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36",
      },
    }).then(({ data }) => {
      const $ = cheerio.load(data) 
      const title = $("div.seriestucon > div.seriestuheader > h1").text()
      const ranting = $('div.rating.bixbox > div.rating-prc > div.num').text()
      const desc = $("div.entry-content.entry-content-single > p").text()
      const status = $('.infotable tr:nth-child(1) td:nth-child(2)').text().trim();
      const type = $('.infotable tr:nth-child(2) td:nth-child(2)').text().trim();
      const released = $('.infotable tr:nth-child(3) td:nth-child(2)').text().trim();
      const author = $('.infotable tr:nth-child(4) td:nth-child(2)').text().trim();
      const artist = $('.infotable tr:nth-child(5) td:nth-child(2)').text().trim();
      const serialization = $('.infotable tr:nth-child(6) td:nth-child(2)').text().trim();
      const postedBy = $('.infotable tr:nth-child(7) td:nth-child(2)').text().trim();
      const postedOn = $('.infotable tr:nth-child(8) td:nth-child(2)').text().trim();
      const updatedOn = $('.infotable tr:nth-child(9) td:nth-child(2)').text().trim();
      const genres = $('.seriestugenre a').map((_, element) => $(element).text().trim()).get();
      
      const chapterList = $('div.eplister > ul > li').map(function () {
        return { 
          chapter: $(this).attr('data-num'),
          url: $(this).find("a").attr("href"),
          downloadUrl: $(this).find("div.dt > a").attr("href")
        }
      }).toArray()
      resolve({
        title,
        ranting,
        desc,
        status,
        type,
        released,
        author,
        artist,
        serialization,
        postedBy,
        postedOn,
        updatedOn,
        genres,
        chapter: chapterList,
      })
    }) 
  })
}

module.exports = {
  kiryuuSearch,
  kiryuuDetail
}