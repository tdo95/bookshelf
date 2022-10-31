const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
  book: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: String,
    required: true
  },
    picture: {
    type: String,
    required: false
  },
    author: {
    type: String,
    required: false
  },
    isbn: {
    type: Number,
    required: false
  }
})

module.exports = mongoose.model('Book', BookSchema)
