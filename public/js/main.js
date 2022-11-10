const deleteBtn = document.querySelectorAll('.del')
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
const bookItems = document.querySelectorAll('.bookItem')
const updateButton = document.querySelectorAll('.update-book')

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteBook)
})

Array.from(selectBook).forEach((el)=>{
  el.addEventListener('click', addBook)
})

modalCloseButton.forEach(button => {
  button.addEventListener('click', closeModal);
})

updateButton.forEach(button => {
  button.addEventListener('click', updateBook)
})

bookItems.forEach( book => {
  book.addEventListener('click', openModal)
})

let timeout;
if (search) {
  search.addEventListener('input', () => {
    //displays results 500 milliseconds after input has stopped coming in
    if (timeout) clearTimeout(timeout); 
    timeout = setTimeout(async () => await searchBooks(search.value), 500); 
  })
}

if (addToLibraryButton) {
  addToLibraryButton.addEventListener('click', addBook)
}

if (addNewButton) {
  addNewButton.addEventListener('click', openModal)
}

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
async function updateBook () {
  const bookStatus = document.querySelector("#status-select").value;
  const bookId = this.parentNode.parentNode.dataset.id;
  console.log(bookId, bookStatus)
  if (!bookStatus) {
    document.querySelector('.error-message').innerText = "Please choose a status";
    return;
  }

  const route = bookStatus === 'reading' ? 'books/markIncomplete' : 'books/markComplete';
  
  try{
    const response = await fetch(route, {
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
            ${match.author_name ? match.author_name.length > 1 ? match.author_name[0] + ', and others' : match.author_name[0] : 'N/A'}
          </span>
        </div>
      </div>
    `
    ).join('')

    matchList.innerHTML = html;
    addListenerToOptions(matchList);
    //uncover section to manually add books to library
    manuelAddSection.classList.remove('hidden')
    
  }
}

const addListenerToOptions = (matchList) => {
  matchList.childNodes.forEach(option => option.addEventListener('click', openModal));
}

function openModal() {
  //if book on shelf or book in discover is clicked (both use the info modal class and format)
  if (this.classList.contains('search-result') || this.classList.contains('bookItem')) {
    //add values
  modalImg.src = this.querySelector('img').src;
  modalTitle.innerText = this.dataset.title;
  modalAuthors.innerText = this.dataset.authors;
  console.log(this, 'has been clicked!');
  //set id on modal so it can be passed with a request
  modalScreenInfo.firstElementChild.setAttribute('data-id', this.dataset.id)
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

