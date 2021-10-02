const express = require('express')
const Article = require('../models/article')
const router = express.Router()

router.get('/new', async (req, res) => {
  res.render('articles/new', {article: new Article()})
})

router.get('/:slug', async (req, res) => {
  try {
    let article = await Article.findOne({ slug: req.params.slug })
    if(article == null) 
      res.redirect('/')
    res.render('articles/show', {article: article})
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

router.get('/edit/:slug', async (req, res) => {
  try {
    let article = await Article.findOne({ slug: req.params.slug })
    res.render('articles/edit', { article: article })
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

_method="DELETE"
router.delete('/:slug', async (req,res) => {
  try {
    let deleted = await Article.deleteOne({slug: req.params.slug})
    if(deleted)
      res.redirect('/')
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

router.post('/', async (req, res) => {
  let article = {
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown
  }
  try {
    if(req.body.slug){
      article = await Article.findOne({slug: req.body.slug})
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
    } else {
      article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
      })
    }
    article = await article.save()
    if(article)
      res.redirect(`/articles/${article.slug}`)
  } catch(err){
    console.log(err)
    res.render('articles/new', {article: article})
  }
  
})

module.exports = router