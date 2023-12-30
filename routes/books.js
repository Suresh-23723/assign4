const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath = path.join('public',Book.coverImageBasePath)
const imageMimeTypes = ['images/jpeg','images/png','images/jpg']
const upload = multer({
    dest : uploadPath,
    fileFilter: (req,file,callback) => {
        callback(null, boolean)
    }
})
//All Books Route
router.get('/',async (req,res)=>{
    res.send('All Books')
})

//New Book Route
router.get('/new', async (req,res) => {
    try {
        const authors = await Author.find({})
        const book = new Book()
        res.render('books/new' , {
            authors : authors,
            book : book
        })
    } catch(err) {
        res.redirect('/books')
    }
})

//Create Book route
router.post('/', upload.single('cover'), async (req,res) => {
    const fileName = req.file != null? req.file.filename : null
    const book = new Book({
        title : req.body.title,
        author : req.body.author,
        publishedDate : new Date(req.body.publishedDate),
        pageCount : req.body.pageCount,
        coverImageName : fileName,
        description : req.body.description  
    })
    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    } catch (err) {
        res.redirect('books')
    }
})

module.exports = router
