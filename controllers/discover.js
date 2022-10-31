const Book = require('../models/Book')

module.exports = {
    getDiscover: (req,res)=>{
        res.render('discover.ejs')
    },
    createBook: async (req, res)=>{
      try{
          await Book.create({book: req.body.bookItem, completed: false, userId: req.user.id})
          console.log('A new book has been added!')
          res.redirect('/books')
      }catch(err){
          console.log(err)
        }
    }
}