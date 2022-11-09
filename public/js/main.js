const deleteBtn = document.querySelectorAll('.del')
const bookItem = document.querySelectorAll('span.not')
const bookComplete = document.querySelectorAll('span.completed')
const search = document.getElementById('search')
const matchList = document.getElementById('match-list')
const searchResult = document.querySelectorAll('.search-result')
const selectBook = document.querySelectorAll('.select-book')
const modalTitle = document.querySelector('.modal-book-title')
const modalImg = document.querySelector('.modal-book-img')
const modalAuthors = document.querySelector('.modal-book-authors')
const modalCloseButton = document.querySelectorAll('.modal-close-button')
const modalScreenInfo = document.querySelector('.modal-screen.info')
const modalScreenInput = document.querySelector('.modal-screen.input')
const addToLibraryButton = document.querySelector('#add-button')
const manuelAddSection = document.querySelector('.manuel-add')
const addNewButton = document.querySelector('.add-new-book')

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

let timeout;
search.addEventListener('input', () => {
  //displays results 500 milliseconds after input has stopped coming in
  if (timeout) clearTimeout(timeout); 
  timeout = setTimeout(async () => await searchBooks(search.value), 500); 
})

modalCloseButton.forEach(button => {
  button.addEventListener('click', closeModal);
})

addToLibraryButton.addEventListener('click', addBook)

addNewButton.addEventListener('click', openModal)

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
async function addBook() {
  //collection book information
  let bookName = modalTitle.innerText.trim();
  let bookImage = modalImg.src.trim();
  let bookAuthors = modalAuthors.innerText.split(',');
  
  //check if link is undefined
  if (bookImage.slice(-13) === 'undefined.jpg') {
    bookImage = null;
  }
  //check if there is no author
  else if (bookAuthors[0] === 'N/A') {
    bookAuthors = null;
  }
  console.log(JSON.stringify({
    bookAuthors,
    bookImage,
    bookName
}))
  //Submit to database
  try{
    const response = await fetch('books/createBook', {
        method: 'post',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            bookAuthors,
            bookImage,
            bookName
        })
    })
    
    window.location.href = "/books"
  }catch(err){
    console.log(err)
  }
}

const searchBooks = async searchText => {
  console.log('Event listener is working!')
  searchText.split(' ').join('+')
  const res = await fetch(`https://openlibrary.org/search.json?q=${searchText}`)
  const books = await res.json()

  let matches = books.docs.slice(0, 10);

  if (searchText.length == 0) {
    matches = []
    matchList.innerHTML = ''
    return;
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
      <div class="search-result" 
      data-title="${match.title}" 
      data-authors="${match.author_name ? match.author_name : 'N/A'}">
        <img src="https://covers.openlibrary.org/b/olid/${match.cover_edition_key}.jpg" alt="${match.title} Cover" class="book-cover">
        <div>
          <h4>${match.title}</h4>
          <span>
            ${match.author_name ? match.author_name : 'N/A'}
          </span>
        </div>
      </div>
    `
    ).join('')

    matchList.innerHTML = html;
    addListenerToOptions(matchList);
    manuelAddSection.classList.remove('hidden')
    
  }
}

const addListenerToOptions = (matchList) => {
  matchList.childNodes.forEach(option => option.addEventListener('click', openModal));
}

function openModal() {
  if (this.classList.contains('search-result')) {
    //add values
  modalImg.src = this.querySelector('img').src;
  modalTitle.innerText = this.dataset.title;
  modalAuthors.innerText = this.dataset.authors;
  console.log(this, 'has been clicked!');
  //unhide info modal
  modalScreenInfo.classList.remove('hidden');

  }
  else modalScreenInput.classList.remove('hidden');
  
}

function closeModal() {
  console.log(this, this.parentNode)
  if (this.parentNode.parentNode.classList.contains('info')) {
  //clear previous values
  modalImg.src = "";
  modalTitle.innerText = "";
  modalAuthors.innerText = "";
  //hide info modal
  modalScreenInfo.classList.add('hidden');

  } 
  else modalScreenInput.classList.add('hidden');
}

