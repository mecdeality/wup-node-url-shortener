const mongoose = require('mongoose')

const url = mongoose.Schema({
  longUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true
  }
})
 const Url = mongoose.model('url', url);


module.exports = Url;