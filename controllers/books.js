const Book = require('../models/Book')

module.exports = {
    getBooks: async (req,res)=>{
        console.log(req.user)
        try{
            const bookItems = await Book.find({userId:req.user.id})
            const itemsLeft = await Book.countDocuments({userId:req.user.id,completed: false})
          // need to add booksRead and booksUnread to display in different sections of the .ejs
            res.render('books.ejs', {books: bookItems, left: itemsLeft, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    createBook: async (req, res)=>{
        try{
            await Book.create({book: req.body.bookItem, completed: false, userId: req.user.id})
            console.log('A new book has been added!')
            res.redirect('/books')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Book.findOneAndUpdate({_id:req.body.bookIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Book.findOneAndUpdate({_id:req.body.bookIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteBook: async (req, res)=>{
        console.log(req.body.bookIdFromJSFile)
        try{
            await Book.findOneAndDelete({_id:req.body.bookIdFromJSFile})
            console.log('Deleted Book')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    