const axios = require("axios");
const os = require("os"); 
const fs = require("fs")
const promises = require("fs/promises");
const pdfkit = require("pdfkit")

const toPDF = async(filename, image) => {
  const pdf = new pdfkit({ autoFirstPage: false });
    const file = filename
      ? `${filename}${filename.endsWith('.pdf') ? '' : '.pdf'}`
        : `${(0, os.tmpdir)()}/${Math.random().toString(36)}.pdf`;
    const stream = (0, fs.createWriteStream)(file);
      pdf.pipe(stream);
    for (const url of image) {
    const { data } = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    const img = pdf.openImage(data);
      pdf.addPage({ size: [img.width, img.height] });
      pdf.image(img, 0, 0);
    const index = image.indexOf(url);
    if (index === image.length - 1)
      pdf.end();
    } 
    await new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(file));
      stream.on('error', reject);
    });
    if (filename)
      return file;
        const buffer = await promises.readFile(file);
      await (0, promises.unlink)(file);
    return buffer;
  } 
  
module.exports.toPDF = toPDF  