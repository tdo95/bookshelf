const Book = require('../models/Book')

module.exports = {
    getLibrary: async (req,res)=>{
        console.log(req.user)
        try{
            const bookItems = await Book.find({userId:req.user.id})
            res.render('library.ejs', {books: bookItems})
        }catch(err){
            console.log(err)
        }
    }
}