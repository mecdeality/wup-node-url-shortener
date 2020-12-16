const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Url = require('./models/url')
const {default: ShortUniqueId} = require('short-unique-id');
const uid = new ShortUniqueId();


const conn = mongoose.connect('mongodb+srv://blog-user-1:test123@node-blog.ggcm8.mongodb.net/url-shortener?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(res => app.listen( process.env.PORT || 3000))
  .catch(err => console.log(err));

app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  let exists = req.app.locals.specialContext;
  req.app.locals.specialContext = null;
  Url.find()
  .then(urls => {
    res.render('index', {exists, urls});
  }).catch(err => console.log(err));
})
app.post('/', (req, res) => {
  Url.findOne({ longUrl: req.body.inputURL })
    .then(result => {
      if(result) {
        req.app.locals.specialContext = true;
        res.redirect('/');
      }
      else{
        Url.create({
          longUrl: req.body.inputURL,
          shortUrl: uid()
        }).then(result => {
          req.app.locals.specialContext = false;
          res.redirect('/')})
          .catch(err => console.log(err));
      }
    });
})
app.get('/:shortUrl', (req, res) => {
  Url.findOne({shortUrl: req.params.shortUrl})
  .then(result => {
    if(result!=null) res.redirect(result.longUrl);
    else {
      res.status(404).render('404');
    }
  }).catch(err => console.log(err));
})
