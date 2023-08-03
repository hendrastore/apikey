const axios = require("axios")
const cheerio = require("cheerio")

const baseURL = "https://komiku.id"

const komikuSearch = async(query) => {
  return new Promise((resolve, reject) => {
    axios.get("https://data.komiku.id/cari/?post_type=manga&s=" + query)
      .then(({ data }) => {
      const $ = cheerio.load(data)
      const result = $("div.daftar > div.bge").map(function () {
        return {
          title: $(this).find("a > h3").text().trim(),
          url: $(this).find("a").attr("href"),
          info: $(this).find(".kan > p").text().trim()
        }
      }).toArray()
      resolve(result)
    })
    .catch((err) => { 
      console.log(err)
    })
  })
} 

const komikuDetail = async(url) => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(({ data }) => {
      const $ = cheerio.load(data)
      const title = $('#Judul > h1').text().trim()
      const sinopsis = $('#Judul > p[class="desc"]').text().trim()
      const judulID = $('.inftable tr:nth-child(1) td:nth-child(2)').text().trim();
      const jenisKomik = $('.inftable tr:nth-child(2) td:nth-child(2)').text().trim();
      const konsepCerita = $('.inftable tr:nth-child(3) td:nth-child(2)').text().trim();
      const komikus = $('.inftable tr:nth-child(4) td:nth-child(2)').text().trim();
      const status = $('.inftable tr:nth-child(5) td:nth-child(2)').text().trim();
      const jumlahPembaca = $('.inftable tr:nth-child(7) td:nth-child(2)').text().trim();
      const image = $('div.ims > img').attr('src').split("?w")[0]
      
      const chapterList = $('.judulseries').map(function () { 
        return {
          creator: "ArifzynXD",
          chapter: $(this).find('span').text().replace("Chapter ", ""),
          url: baseURL + $(this).find('a').attr('href'), 
        }
      }).toArray()
      
      resolve({
        title,
        sinopsis,
        judulID,
        jenisKomik,
        konsepCerita,
        komikus,
        status,
        jumlahPembaca,
        image,
        chapterList
      })
   })
   .catch((err) => { 
      console.log(err)
   })
 })
}


const komikuDownload = async (url) => { 
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(({ data }) => {
      const $ = cheerio.load(data)
      const image = $('#Baca_Komik > img').map(function () {
        return $(this).attr("src")
      }).toArray()
      resolve({
        title: $('#Judul > h1').text().trim().split("\t")[0].trim(),
        images: image
      })
    })
    .catch((err) => { 
      console.log(err)
    })
  })
}

module.exports = {
  komikuSearch,
  komikuDetail,
  komikuDownload
}
