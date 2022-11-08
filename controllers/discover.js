const Book = require('../models/Book')

module.exports = {
    getDiscover: (req,res)=>{
        res.render('discover.ejs')
    }
}