const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const compression = require('compression')
require('dotenv').config()
const app = express()

const port = process.env.PORT || 5000
const host = process.env.HOST
const db_uri = process.env.DB_URI

process.on('unhandledRejection', function(err) {
  console.log(err);
});

mongoose.connect(db_uri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(mongoose => {
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('mongodb connected ...')
  });
}).catch(err => {
  console.log(err)
})


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(compression())


app.get('/', async (req, res) => {
  try {
    let articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index', {articles: articles})
  } catch (err) {
    console.log(err)
    res.status(500).render('articles/index', {articles: {}})
  }
})
app.use('/articles', articleRouter)


app.listen(port)
console.log(`server started at : https://${host}:${port}`)
