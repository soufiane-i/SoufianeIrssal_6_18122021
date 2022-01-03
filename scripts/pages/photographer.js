// DOM Elements
const filterBtns = document.querySelectorAll('.filter-btn')
const filterChevron = document.querySelector('.filter-chevron')

filterBtns[0].addEventListener('click', () => {
    for(let i = 1; i<filterBtns.length; i++) {
        filterBtns[i].style.display = 'flex'
        filterChevron.style.transform = 'rotate(0deg)'
    }
})



// Data Elements




async function getPhotographer(){
    
    // Récupération des données en json
    let res = await fetch('/data/photographers.json')
    if(res.ok){
        data = await res.json()
    } else {
        console.error('retour serveur : ', res.status)
    }

    //Get id in Url----------------------------------------------------------------------

    //Get parameters after the ? include inthe url
    const queryString = window.location.search 
    //Parse the query string parameters
    const urlParams = new URLSearchParams(queryString)
    //get the id parameter 
    const idSearch = urlParams.get('id')

    //------------------------------------------------------------------------------------
     
    // return des objets correspondant à l'id de la page
    
    return {
        photographer : data.photographers.find(element => element.id == `${idSearch}`)
    }
} 




async function displayData(photographer) {
    const photographerSection = document.querySelector('.photographer-section')
    const photographerModel = photographerFactory(photographer)
    const userProfileDOM = photographerModel.getUserProfileDOM()
    photographerSection.appendChild(userProfileDOM)
}

async function init() {
    // Récupère les datas des photographes
    const { photographer } = await getPhotographer()
    displayData(photographer)
}
    
init()








