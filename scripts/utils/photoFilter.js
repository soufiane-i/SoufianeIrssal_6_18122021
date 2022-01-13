// DOM Elements
const filterBtns = document.querySelectorAll('.filter-btn')
const filterChevron = document.querySelector('.filter-chevron')
const filterDate = document.querySelector('.filter-date')
const filterPopularity = document.querySelector('.filter-popularity')
const filterTitle = document.querySelector('.filter-title')

let isFilterOpen = false



filterBtns[0].addEventListener('click', () => {


        for(let i = 1; i<filterBtns.length; i++) {
            filterBtns[i].classList.toggle('filter-btn-disable')
            
        }
        filterChevron.classList.toggle('filter-btn-chevron-disable')

        isFilterOpen = !isFilterOpen


})



filterDate.addEventListener('click', () => {


    for(let i = 1; i<filterBtns.length; i++) {
        filterBtns[i].classList.toggle('filter-btn-disable')
            
    }
    filterChevron.classList.toggle('filter-btn-chevron-disable')

    isFilterOpen = !isFilterOpen


})





