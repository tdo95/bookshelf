const deleteBtn = document.querySelectorAll('.del')
const bookItem = document.querySelectorAll('span.not')
const bookComplete = document.querySelectorAll('span.completed')
const search = document.getElementById('search')
const matchList = document.getElementById('match-list')
const searchResult = document.querySelectorAll('.search-result')
const selectBook = document.querySelectorAll('.select-book')

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteBook)
})

Array.from(bookItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(bookComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

Array.from(selectBook).forEach((el)=>{
  el.addEventListener('click', addBook)
})

search.addEventListener('input', () => searchBooks(search.value))

Array.from(searchResult).forEach((el) => {
  el.addEventListener('click', displayResult)
})
            
                     

async function deleteBook(){
  console.log('Event listener is working!')
    const bookId = this.parentNode.dataset.id
    try{
        const response = await fetch('books/deleteBook', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'bookIdFromJSFile': bookId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const bookId = this.parentNode.dataset.id
    try{
        const response = await fetch('books/markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'bookIdFromJSFile': bookId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const bookId = this.parentNode.dataset.id
    try{
        const response = await fetch('books/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'bookIdFromJSFile': bookId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

const searchBooks = async searchText => {
  console.log('Event listener is working!')
  searchText.split(' ').join('+')
  const res = await fetch(`https://openlibrary.org/search.json?q=${searchText}`)
  const books = await res.json()

  let matches = books.docs

  if (searchText.length == 0) {
    matches = []
    matchList.innerHTML = ''
  }

  // storeSearchResults(matches)
  outputHtml(matches)

  console.log(matches)
}

// let searchResultBooks = {}
// storeSearchResults(matches) {
//   matches.forEach(match => 
//     //stores search result info in an object
//     searchResultBooks[uniqueIdentifier, maybe match.cover_edition_key] = {
//       title: match.title,
//       author: match.
//       imageLink: `https://covers.openlibrary.org/b/olid/${match.cover_edition_key}.jpg`
//     }
//   )
// }

const outputHtml = matches => {
  console.log('We have matches!')
  if (matches.length > 0) {
    const html = matches.map(match => `
      <div class="search-result">
        <img src="https://covers.openlibrary.org/b/olid/${match.cover_edition_key}.jpg" alt="${match.title} Cover" class="book-cover">
        <div>
          <h4>${match.title}</h4>
          <span>${match.author_name}</span>
        </div>
      </div>
    `
    ).join('')

    matchList.innerHTML = html
  }
}

// const displayResult = 

