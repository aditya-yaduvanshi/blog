const mongoose = require('mongoose')
const slugify = require('slugify')
const dompurify = require('dompurify')
const { JSDOM } = require('jsdom')
const marked = require('marked')

const domPurify = dompurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
})

articleSchema.pre('validate', async function (next) {
  if(this.title){
    this.slug = await slugify(this.title, { lower: true, strict: true })
  }
  if(this.markdown){
    this.sanitizedHtml = domPurify.sanitize(marked(this.markdown))
  }
  next()
})

module.exports = mongoose.model('Article', articleSchema)