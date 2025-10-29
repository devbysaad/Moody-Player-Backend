var ImageKit = require('imagekit');
require('dotenv').config({ path: './.env' }); // fixed path

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URLENDPOINT,
});

function uploadFile(file) {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: file.buffer,
        fileName: file.originalname || `upload_${Date.now()}`,
        folder: "songs"
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
}

module.exports = uploadFile;
