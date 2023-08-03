const express = require("express")  
const FormData = require("form-data");
const type = require("file-type");
const fetch = require("node-fetch");
const fs = require("fs")
const router = express.Router()

// scrape
const kiryuu = require("../lib/kiryuu");
const mangatoon = require("../lib/mangatoon");
const kusonime = require("../lib/kusonime");
const komiku = require("../lib/komiku");
const { toPDF } = require("../lib/pdf");
const { TiktokDL } = require("../lib/tiktok");
const { instagram } = require("../lib/instagram");
const { Spotify } = require("../lib/spotify");

const spotify = new Spotify()

async function uploadFile2(buffer) {
  let { ext } = await type.fromBuffer(buffer);
  let bodyForm = new FormData();
  bodyForm.append("file", buffer, "file." + ext);
  const response = await fetch("https://my.arifzyn.com/api/upload.php", {
    method: "post",
    body: bodyForm,
  });
  return {
    status: response.status,
    creator: "ArifzynXD",
    result: (await response.json()).result,
  };
}

router.get("/api/kiryuu/search", async (req, res, next) => {
    let text = req.query.text
    if (!text) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Query Text !" })
    await kiryuu.kiryuuSearch(text)
      .then((data) => {
        res.json({
          status: true,
          creator: "ArifzynXD",
          result: data,
        })
    })
      .catch((err) => {
        console.log(err)
        res.json({ message: "Terjadi kesalahan !" })
    })
})

router.get("/api/kiryuu/detail", async (req, res, next) => {
    let url = req.query.url
    if (!url) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Parameter Url !" })
    await kiryuu.kiryuuDetail(url)
      .then((data) => {
        res.json({
          status: true,
          creator: "ArifzynXD",
          result: data,
        })
    })
      .catch((err) => {
        console.log(err)
        res.json({ message: "Terjadi kesalahan !" })
    })
})

router.get("/api/mangatoon/search", async (req, res, next) => {
    let text = req.query.text
    if (!text) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Parameter text !" })
    await mangatoon.mangatoonSearch(text)
      .then((data) => {
        res.json({
          status: true,
          creator: "ArifzynXD",
          result: data,
        })
    })
      .catch((err) => {
        console.log(err)
        res.json({ message: "Terjadi kesalahan !" })
    })
})

router.get("/api/mangatoon/detail", async (req, res, next) => {
    let url = req.query.url
    if (!url) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Parameter Url !" })
    await mangatoon.mangatoonDetail(url)
      .then((data) => {
        res.json({
          status: true,
          creator: "ArifzynXD",
          result: data,
        })
    })
      .catch((err) => {
        console.log(err)
        res.json({ message: "Terjadi kesalahan !" })
    })
})

router.get("/api/kusonime/search", async (req, res, next) => {
    let text = req.query.text
    if (!text) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Parameter text !" })
    await kusonime.kusonimeSearch(text)
      .then((data) => {
        res.json({
          status: true,
          creator: "ArifzynXD",
          result: data,
        })
    })
      .catch((err) => {
        console.log(err)
        res.json({ message: "Terjadi kesalahan !" })
    })
})

router.get("/api/kusonime/detail", async (req, res, next) => {
    let url = req.query.url
    if (!url) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Parameter Url !" })
    await kusonime.kusonimeDetail(url)
      .then((data) => {
        res.json({
          status: true,
          creator: "ArifzynXD",
          result: data,
        })
    })
      .catch((err) => {
        console.log(err)
        res.json({ message: "Terjadi kesalahan !" })
    })
})

router.get("/api/komiku/search", async (req, res, next) => {
    let text = req.query.text
    if (!text) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Parameter text !" })
    await komiku.komikuSearch(text)
      .then((data) => {
        res.json({
          status: true,
          creator: "ArifzynXD",
          result: data,
        })
    })
      .catch((err) => {
        console.log(err)
        res.json({ message: "Terjadi kesalahan !" })
    })
})

router.get("/api/komiku/detail", async (req, res, next) => {
    let url = req.query.url
    if (!url) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Parameter url !" })
    await komiku.komikuDetail(text)
      .then((data) => {
        res.json({
          status: true,
          creator: "ArifzynXD",
          result: data,
        })
    })
      .catch((err) => {
        console.log(err)
        res.json({ 
          message: "Terjadi kesalahan !" 
       })
    })
})

router.get("/api/komiku/download", async (req, res, next) => {
    let url = req.query.url
    if (!url) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Parameter url !" })
    await komiku.komikuDownload(url)
      .then(async (rest) => {
      	await toPDF("./tmp/" + rest.title + ".pdf", rest.images)
      	  .then(async (data) => {
      	  	let buffer = fs.readFileSync("./tmp/" + rest.title + ".pdf")
      	  	let urll = await uploadFile2(buffer)
      	  	res.json({
      	  		status: true,
      	  		creator: "ArifzynXD",
      	  		result: urll.result.url,
      	  	})
      	  	fs.unlink("tmp/" + rest.title + ".pdf", (err) => {
      	  		if (err) {
      	  			console.error(err);
      	  			return;
                    }

                console.log('File berhasil dihapus');
              });
            })  
       })
      .catch((err) => {
        console.log(err)
        res.json({ message: "Terjadi kesalahan !" })
    })
})

router.get("/api/download/tiktok", async (req, res, next) => {
	let url = req.query.url
    if (!url) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Parameter url !" })
    await TiktokDL(url)
      .then((data) => {
      	res.json({
      		status: true,
      		creator: "ArifzynXD",
      		result: data.result,
      	})  	
      })
      .catch((err) => {
        console.log(err)
        res.json({ message: "Terjadi kesalahan !" })
    })
})

router.get("/api/download/instagram", async (req, res, next) => {
	let url = req.query.url
    if (!url) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Parameter url !" })
    await instagram(url)
      .then((data) => {
      	res.json({
      		status: true,
      		creator: "ArifzynXD",
      		result: data,
      	})  	
      })
      .catch((err) => {
        console.log(err)
        res.json({ message: "Terjadi kesalahan !" })
    })
})

router.get("/api/search/spotify", async (req, res, next) => {
	let text = req.query.text
    if (!text) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Parameter text !" })
    await spotify.search(text)
      .then((data) => {
      	res.json({
      		status: true,
      		creator: "ArifzynXD",
      		result: data,
      	})  	
      })
      .catch((err) => {
        console.log(err)
        res.json({ message: "Terjadi kesalahan !" })
    })
})

router.get("/api/download/spotify", async (req, res, next) => {
	let url = req.query.url
    if (!url) return res.json({ status: false, creator: "ArifzynXD", message: "Masukan Parameter url !" })
    await spotify.download(url)
      .then((data) => {
      	res.json({
      		status: true,
      		creator: "ArifzynXD",
      		result: data,
      	})  	
      })
      .catch((err) => {
        console.log(err)
        res.json({ message: "Terjadi kesalahan !" })
    })
})


module.exports = router