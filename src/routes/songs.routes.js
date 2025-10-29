const express = require('express');
const multer = require('multer');
const uploadFile = require('../services/storege.service');
const songModel = require('../models/song.model');
const router = express.Router();

const uploadSongs = multer({ storage: multer.memoryStorage() });

router.post('/songs', uploadSongs.single('audio'), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const fileData = await uploadFile(req.file);
  console.log("FileData:", fileData.url);

  const song = await songModel.create({
    title: req.body.title,
    artist: req.body.artist,
    audio: fileData.url,
    mood: req.body.mood
  });

  res.status(201).json({
    message: 'Song Added',
    song
  });
});
 router.get("/songs", async (req, res) => {
  try {
    const { mood } = req.query;
    if (!mood) return res.status(400).json({ message: "Mood required" });

     const songs = await songModel.find({ mood });
    return res.json({ message: "Songs fetched", songs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
router.get("/check", (req, res) => {
  res.send("🎵 Songs route working!");
});
module.exports = router;
