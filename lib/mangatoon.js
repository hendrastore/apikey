const axios = require("axios");
const cheerio = require("cheerio");

const baseUrl = "https://mangatoon.mobi"

const mangatoonSearch = async(query) => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url: baseUrl + "/id/search?word=" + query,
        method: "GET",
        headers: {
          "user-agent": "Mozilla/5.0 (Linux; Android 10; RMX2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36",
      },
    }).then(({ data }) => {
      const $ = cheerio.load(data);
      const hasil = $("#page-content > div.search-page > div.have-result > div.comics-result > div.recommended-wrap > div.recommend-comics > div.recommend-item").map(function () {
        const result = {
          title: $(this).find("div.recommend-comics-title > span").text().trim(),
          image: $(this).find("a > div.comics-image > img").attr("data-src"),
          url: baseUrl + $(this).find("a").attr("href")
        }
        return result
      }).toArray()    
        resolve(hasil)
     })
  })
}

const mangatoonDetail = async (url) => {
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
      const title = $("#page-content > div.detail-wrap > div.detail-top-info > div.detail-info > div.detail-title-bg > span").text()
      const image = $("#page-content > div.detail-wrap > div.detail-top-info > div.detail-img").find("img").attr("src")
      const info = $("#page-content > div.detail-wrap > div.detail-top-info > div.detail-info > div.detail-tags-info.select-text").text()
      const chapter = $("#page-content > div.selected-episodes > div.episodes-wrap-new > a").map(function () {
        return {       
          url: baseUrl + $(this).attr("href"),
          info: $(this).find("div.item-top-2 > div.episode-title-new-2").text().trim()
        }
      }).toArray()
      resolve({
        title,
        image,
        info,
        chapter
      })
    })
  })
}

module.exports = {
  mangatoonSearch,
  mangatoonDetail
} 