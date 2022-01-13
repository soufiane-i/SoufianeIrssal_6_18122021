async function getPhotographer(){
    // Récupération des données en json
    let res = await fetch('/data/photographers.json')
    if(res.ok){
        data = await res.json()
    } else {
        console.error('retour serveur : ', res.status)
    }
    //Get parameters after the ? include inthe url
    const queryString = window.location.search 
    //Parse the query string parameters
    const urlParams = new URLSearchParams(queryString)
    //get the id parameter 
    const idSearch = urlParams.get('id')

    // return des objets correspondant à l'id de la page
    return {
        photographer : data.photographers.find(element => element.id == `${idSearch}`)
    }
} 


async function getMedias(){
    
    // Récupération des données en json
    let res = await fetch('/data/photographers.json')
    if(res.ok){
        data = await res.json()
    } else {
        console.error('retour serveur : ', res.status)
    }
    //Get parameters after the ? include inthe url
    const queryString = window.location.search 
    //Parse the query string parameters
    const urlParams = new URLSearchParams(queryString)
    //get the id parameter 
    const idSearch = urlParams.get('id')
     
    // return des objets correspondant à l'id de la page
    return {  
        mediasProp : data.media.filter(element => element.photographerId == `${idSearch}`)   
    }
} 



async function displayData(photographer) {
    const photographerSection = document.querySelector('.photographer-section')
    const photographerModel = photographerFactory(photographer)
    const userProfileDOM = photographerModel.getUserProfileDOM()
    photographerSection.appendChild(userProfileDOM)
    const price = document.getElementById('price')
    price.textContent = photographer.price   
}


function displayMedias(mediasProp, heartEvent, mediasClickEvent) {
    const mediasSection = document.querySelector('.cards-photo')
    mediasProp.forEach((media) => {
        const mediaModel = mediaFactory(media)
        const mediaCardDOM = mediaModel.getImageCardDOM()
        mediasSection.appendChild(mediaCardDOM)
        
    })
    heartEvent()
    mediasClickEvent()
}

async function init() {
    // Récupère les datas des photographes
    const { photographer } = await getPhotographer()
    const { mediasProp } = await getMedias()
    displayData(photographer)
    displayMedias(mediasProp, heartEvent, mediasClickEvent)
}

getMedias()
init()

//Système de like---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

let heartTotal = document.querySelector('.like-number')
let hearts = document.getElementsByClassName('heart')

let likeTotal = 0

heartTotal.textContent = likeTotal

//Ecoute des cliques sur les coeurs de chaques element de la section media
function heartEvent() {
    for (let i = 0; i < hearts.length; i++) {
        hearts[i].addEventListener("click", heartClick) 
    }
}

//A chaque clique, le ccompteur du coeur local et du coeur global sont incrementés
function heartClick(e) {
    let targetHeart = e.target.parentNode.firstChild
    heartTotal.textContent++
    targetHeart.textContent++ 
}


//Section media et lightbox---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//DOM Element
let mediasClick = document.getElementsByClassName('media')
const lightbox = document.querySelector('.lightbox-modal')
let lightboxContainer = document.querySelector('.lightbox-container')
const lightboxCrossBtn = document.querySelector('.fa-times')
const lightboxPrev = document.querySelector('.lightbox-prev')
const lightboxNext = document.querySelector('.lightbox-next')


//Ecoute des cliques sur les elements de la section media
function mediasClickEvent() { 
    for (let i = 0; i < mediasClick.length; i++) {
        mediasClick[i].addEventListener("click", mediasClickFunction)  
    }
}
//Lightbox - Ecoute des cliques sur la croix pour fermer et des fleches pour naviguer entre les elements souhaités avec appel des fonctions associées
lightboxCrossBtn.addEventListener('click', lightboxClose)
lightboxPrev.addEventListener('click', previousMedia)
lightboxNext.addEventListener('click', nextMedia)


// Fonction appélée lors du clique sur un element dans la section media
function mediasClickFunction(e) {
    //recuperation de l'élement cliqué avec son src et son name
    let targetMedia = e.target
    let targetMediasSrc = targetMedia.src
    let targetMediasTitle = targetMedia.name
    //Récuperation d'élément du DOM
    let lightboxImg = document.querySelector('.lightbox-img')
    let lightboxVideo = document.querySelector('.lightbox-video')
    let lightboxTitle = document.querySelector('.lightbox-title')
    
    
    /*Si le lightboxContainer ne contient ni photo ni video, create l'élement souhaité avec le bon receptacle(img ou video)
    tout en creant l'autre mais caché afin de ne pas avoir à en creer à chaque fois mais seulement à changer le src, le name et le titre */ 
    if(lightboxContainer.childElementCount == 0) {
        if(targetMedia.hasAttribute('controls')) {

            lightboxVideo = document.createElement('video')
            lightboxVideo.classList.add('lightbox-video')
            lightboxVideo.setAttribute('src', targetMediasSrc)
            lightboxContainer.appendChild(lightboxVideo)

            lightboxImg = document.createElement('img')
            lightboxImg.classList.add('lightbox-img', 'lightbox-element-disable')
            lightboxContainer.appendChild(lightboxImg)

        } else {
            
            lightboxImg = document.createElement('img')
            lightboxImg.setAttribute('name', targetMediasTitle)
            lightboxImg.classList.add('lightbox-img')
            lightboxImg.setAttribute('src', targetMediasSrc)
            lightboxContainer.appendChild(lightboxImg)

            lightboxVideo = document.createElement('video')
            lightboxVideo.classList.add('lightbox-video', 'lightbox-element-disable')
            lightboxContainer.appendChild(lightboxVideo)

        }

        lightboxTitle = document.createElement('h3')
        lightboxTitle.classList.add('lightbox-title')

    } else {
            if(targetMedia.hasAttribute('controls')) {
            } else {
                lightboxImg.setAttribute('name', targetMediasTitle)
                lightboxImg.classList.add('lightbox-img')
                lightboxImg.setAttribute('src', targetMediasSrc)  
                lightboxImg.classList.remove('lightbox-element-disable')
            }
    }

    lightboxTitle.textContent = targetMediasTitle
    lightboxContainer.appendChild(lightboxTitle)
    //Fait reaparraitre la lightbox et desactiver le scroll
    lightbox.classList.remove('lightbox-modal-disable')
    document.body.style.overflow = "hidden"    
}




//Ferme la lightbox en desactivant ses element et en reactivant le overflow permettant le scroll
function lightboxClose() {
    let lightboxImg = document.querySelector('.lightbox-img')
    let lightboxVideo = document.querySelector('.lightbox-video')
    lightboxVideo.classList.add('lightbox-element-disable')
    lightboxImg.classList.add('lightbox-element-disable')
    lightbox.classList.add('lightbox-modal-disable')
    document.body.style.overflow = 'auto'
    
    
}

//Fonction appelée lors du clique sur la fleche de gauche de la lightbox permettant de passer à l'élement precédent
function previousMedia(e) {
    
    //LightboxSliding(next ou previous, element cliqué)
    lightboxSliding(0,e)
} 

//Fonction appelée lors du clique sur la fleche de droite de la lightbox permettant de passer à l'élement suivant
function nextMedia(e) {

   lightboxSliding(1,e)
} 

//Fonction changeant l'élement de la lightbox en fonction de souhait d'avoir la precedante ou la suivante
function lightboxSliding(direction, arrow) {

    //DOM Elements
    let lightboxImg = document.querySelector('.lightbox-img')
    let lightboxVideo = document.querySelector('.lightbox-video')
    let lightboxTitle = document.querySelector('.lightbox-title')

    //Variables
    let actualElement
    let nextElement

    // Récuperer l'élément du tableau mediasClick regroupant tout les medias à l'aide du name de l'élément dand la lightbox en fonction de sa nature d'img ou de video
    // Savoir si c'est une img ou une video grace à la classe 'lightbox-element-disable' permettant de savoir si l'img est caché ce qui voudrait dire que l'élement actuel est une video
    if(lightboxImg.classList.contains('lightbox-element-disable')){
        //A partir de la fleche sur laquelle on clique, on remonte au parent afin de retrouver l'enfant correspondant à l'img ou à la video sachant que les deux chemin sont différents
        let actualVideoName = arrow.target.parentNode.childNodes[3].childNodes[2].getAttribute('name')
        // Grace au name on cherche la photo correspondant dans le tableau media regroupant tout les element
        actualElement = mediasClick.namedItem(actualVideoName)
    } else {
        let actualImgName = arrow.target.parentNode.childNodes[3].childNodes[1].name
        actualElement = mediasClick.namedItem(actualImgName)
    }


    //Direction == 1 correspond au next appelé dans la fonction nextMedia et 0 l'inverse. En fonction du sens souhaité on navigue dans le tableau media grace à la propriété nextSibling ou previousSibling
    if (direction == 1) {
        nextElement = actualElement.parentNode.parentNode.nextSibling.childNodes[0].childNodes[0]
    } else {
        nextElement = actualElement.parentNode.parentNode.previousSibling.childNodes[0].childNodes[0]
    }

    // On récupère le nom et le src de l'élément suivant  à afficher
    let nextElementName = nextElement.getAttribute('name') 
    let nextElementSrc = nextElement.src

    // En fonction de si l'élement à afficher est une img ou une video (grace à la fonction control des videos) faire apparaitre le bon receptacle
    if(nextElement.hasAttribute('controls')) {
        lightboxImg.classList.add('lightbox-element-disable')
        lightboxVideo.classList.remove('lightbox-element-disable')
        lightboxVideo.setAttribute('src', nextElementSrc)
        lightboxVideo.setAttribute('name', nextElementName)
    } else {
        lightboxVideo.classList.add('lightbox-element-disable')
        lightboxImg.classList.remove('lightbox-element-disable')
        lightboxImg.setAttribute('src', nextElementSrc)
        lightboxImg.setAttribute('name', nextElementName)
    } 
    // Mise à jour du texte correspondant à l'élément
    lightboxTitle.textContent = nextElementName
}