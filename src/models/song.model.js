const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  audio: String, // ✅ change from url → audio
  mood: String,
});

const songModel = mongoose.model("Song", songSchema);
module.exports = songModel;