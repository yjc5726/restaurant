const display = document.querySelector('.display-mode')
const cardMode = document.querySelector('.card-mode')
const listMode = document.querySelector('.list-mode')
const index = document.querySelector('.index')

window.addEventListener('load', function () {
  if (JSON.parse(sessionStorage.getItem('display')) === 'columns') {
    cardMode.style.display = 'block'
    listMode.style.display = 'none'
  } else {
    sessionStorage.setItem('display', JSON.stringify('list'))
    listMode.style.display = 'block'
    cardMode.style.display = 'none'
  }
})
display.addEventListener('click', displayMode)
function displayMode (e) {
  if (e.target.classList.contains('columns')) {
    sessionStorage.setItem('display', JSON.stringify('columns'))
    cardMode.style.display = 'block'
    listMode.style.display = 'none'
  } else {
    sessionStorage.setItem('display', JSON.stringify('list'))
    listMode.style.display = 'block'
    cardMode.style.display = 'none'
  }
}
index.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-button')) {
    const yes = confirm('確定刪除？')
    if (yes) {
      alert('已刪除')
    } else {
      e.preventDefault()
    }
  }
})
