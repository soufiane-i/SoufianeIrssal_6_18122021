// DOM Elements
const filterBtns = document.querySelectorAll('.filter-btn')
const filterChevron = document.querySelector('.filter-chevron')

filterBtns[0].addEventListener('click', () => {
    for(let i = 1; i<filterBtns.length; i++) {
        filterBtns[i].style.display = 'flex'
        filterChevron.style.transform = 'rotate(0deg)'
    }
})