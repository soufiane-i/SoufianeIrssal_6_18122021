/* eslint-disable no-undef */

const header = document.querySelector('header')
const logo = document.querySelector('.logo')
const modalContainer = document.getElementById('contact_modal')
const modal = document.querySelector('.modal')
const filterDropDown = document.getElementById('filters-dropdown')
const filterLabel = document.querySelector('.filter-label')
const likeNPrice = document.querySelector('.like-and-price')

// Récupération des infos d'un photographes selon l'id dans l'url
async function getJsonElements(e){
	//Récuperation de l'Id dans l'URL
	getURLId()
	// Récupération des données en json
	let res = await fetch('/data/photographers.json')
	if(res.ok){
		data = await res.json()
	} else {
		console.error('retour serveur : ', res.status)
	}
	// return des objets correspondant à l'id de la page
	if (e == 'photographer') {
		return {
			photographer : data.photographers.find(element => element.id == `${idSearch}`)
		} 
	} else if (e == 'medias') {
		return {  
			mediasProp : data.media.filter(element => element.photographerId == `${idSearch}`)   
		}
	}
} 

function getURLId() {
	//Get parameters after the ? include inthe url
	const queryString = window.location.search 
	//Parse the query string parameters
	const urlParams = new URLSearchParams(queryString)
	//get the id parameter 
	return idSearch = urlParams.get('id')
}

// Afficher la carte de profil + le tarif/jour 
async function displayProfilCard(photographer) {
	//Trouver l'endroit dans lequel mettre 
	const photographerSection = document.querySelector('.photographer-section')
	// Associer le bon modèle dans le photograppher Factory
	const photographerModel = photographerFactory(photographer)
	const userProfileDOM = photographerModel.getUserProfileDOM()
	photographerSection.appendChild(userProfileDOM)
}

async function displayDailyPrice(photographer) {
	//Utiliser la donnée Json price pour afficher le tarif journalier
	const price = document.getElementById('price')
	price.textContent = photographer.price   
}

//Affcher les photos et vidéos du profil. 
//DOM Element
let heartTotal = document.querySelector('.like-number')

function displayMedias(mediasProp, heartEvent, mediasElementsEvent) {
	const mediasSection = document.querySelector('.cards-photo')
	// Associer le bon modèle dans le photograppher Factory pour chaque media(photo ou video) avec le bon nombre de coeur mis à jour
	mediasProp.forEach((media) => {
		const mediaModel = mediaFactory(media)
		const mediaCardDOM = mediaModel.getMediaCardDOM()
		mediasSection.appendChild(mediaCardDOM)
		heartTotal.textContent = parseInt(heartTotal.textContent) + media.likes 
	})
	//Rappel de ses fonction à chaque affichage pour mettre à jour les localisations
	heartEvent()
	mediasElementsEvent()
	mediasElementsTabEvent()
}

//Activation des fonctions d'affichage de la carte de profil, du tarif journalier et des photos et video après avoir recceuilli les données Json
async function init() {
	// Récupère les datas des photographes et les associe à chaque fonctions dédiées
	const { photographer } = await getJsonElements('photographer')
	const { mediasProp } = await getJsonElements('medias')
	displayProfilCard(photographer)
	displayDailyPrice(photographer)
	displayMedias(mediasProp, heartEvent, mediasElementsEvent, mediasElementsTabEvent)
	filter(0)
	photosSectionTab(1)
	profilCardTab(1)
	filterTab(1)
	header.focus()
}
init()

//Système de like-----------------------------------------------------------------------------------------------------------------------------------
//DOM Element
let hearts = document.getElementsByClassName('heart')


//Ecoute des cliques sur les coeurs de chaques element de la section media
function heartEvent() {
	for (let i = 0; i < hearts.length; i++) hearts[i].addEventListener('click', heartsIncrementation) 
}

//A chaque clique, le compteur du coeur local et du coeur global sont incrementés
function heartsIncrementation(e) {
	let targetHeart = e.target.parentNode.firstChild
	heartTotal.textContent++
	targetHeart.textContent++ 
}

//Section media et lightbox-------------------------------------------------------------------------------------------------------------------------
//DOM Element
let mediasElements = document.getElementsByClassName('media')
let cardsPhotoContainer = document.getElementsByClassName('card-photo-container')
const lightbox = document.querySelector('.lightbox-modal')
let lightboxContainer = document.querySelector('.lightbox-container')
const lightboxCrossBtn = document.querySelector('.lightbox-close')
const lightboxPrev = document.querySelector('.lightbox-prev-i')
const lightboxNext = document.querySelector('.lightbox-next-i')




//Ecoute des cliques sur les elements de la section media
function mediasElementsEvent() { 
	for (let i = 0; i < mediasElements.length; i++) mediasElements[i].addEventListener('click', displayLightBox)  

}

function mediasElementsTabEvent() { 
	for (let i = 0; i < mediasElements.length; i++) mediasElements[i].addEventListener('keypress', displayLightBox )  
} 

//Lightbox - Ecoute des cliques sur la croix pour fermer et des fleches pour naviguer entre les elements souhaités avec appel des fonctions associées
lightboxCrossBtn.addEventListener('click', lightboxClose)
lightboxPrev.addEventListener('click', previousMedia)
lightboxNext.addEventListener('click', nextMedia)
lightboxCrossBtn.addEventListener('keypress', lightboxClose)
lightboxPrev.addEventListener('keypress', previousMedia)
lightboxNext.addEventListener('keypress', nextMedia)


// Fonction appélée lors du clique sur un element dans la section media
function displayLightBox(e) {

		

		
	//recuperation de l'élement cliqué avec son src et son name
	let targetMedia = e.target
	let targetMediasSrc = targetMedia.src
	let targetMediasTitle = targetMedia.getAttribute('name')
		
	//Récuperation d'élément du DOM
	let lightboxImg = document.querySelector('.lightbox-img')
	let lightboxVideo = document.querySelector('.lightbox-video')
	let lightboxTitle = document.querySelector('.lightbox-title')
		
	/*Si le lightboxContainer ne contient ni photo ni video, create l'élement souhaité avec le bon receptacle(img ou video)
		tout en creant l'autre mais caché afin de ne pas avoir à en creer à chaque fois mais seulement à changer le src, le name et le titre */ 
	if(lightboxContainer.childElementCount == 0) {
		lightboxImg = document.createElement('img')
		lightboxVideo = document.createElement('video')
		lightboxTitle = document.createElement('h3')

		if(targetMedia.classList.contains('videoElement')) {
			lightboxImg.classList.add('lightbox-img', 'lightbox-element-disable')
			lightboxVideo.setAttribute('name', targetMediasTitle)
			lightboxVideo.setAttribute('src', targetMediasSrc)
			lightboxVideo.setAttribute('controls', 'controls')
			lightboxVideo.setAttribute('tabindex', '1')
		} else {
			lightboxImg.setAttribute('name', targetMediasTitle)
			lightboxImg.classList.add('lightbox-img')
			lightboxImg.setAttribute('src', targetMediasSrc)
			lightboxImg.setAttribute('tabindex', '1')
			lightboxVideo.classList.add('lightbox-element-disable')

		}

		lightboxVideo.classList.add('lightbox-video')
		lightboxTitle.classList.add('lightbox-title')

		lightboxContainer.appendChild(lightboxImg)
		lightboxContainer.appendChild(lightboxVideo)
	} else {
		lightboxImg.setAttribute('name', targetMediasTitle)

		if(targetMedia.classList.contains('videoElement')) {
			lightboxVideo.classList.add('lightbox-video')
			lightboxVideo.classList.remove('lightbox-element-disable')
			lightboxVideo.setAttribute('src', targetMediasSrc)
			lightboxVideo.setAttribute('tabindex', '0')  

			lightboxContainer.appendChild(lightboxVideo)

		} else {
			lightboxImg.classList.add('lightbox-img')
			lightboxImg.setAttribute('src', targetMediasSrc)  
			lightboxImg.setAttribute('tabindex', '0')
			lightboxImg.classList.remove('lightbox-element-disable')
		}
	}

	lightboxTitle.textContent = targetMediasTitle
	lightboxContainer.appendChild(lightboxTitle)
	//Fait reaparraitre la lightbox
	lightbox.classList.remove('lightbox-modal-disable')
	//Désactiver scroll 
	document.body.style.overflow = 'hidden'  
	lightboxCrossBtn.setAttribute('aria-hidden', 'false')
	lightboxPrev.setAttribute('aria-hidden', 'false')	
	lightboxNext.setAttribute('aria-hidden', 'false')
	let formBtn = document.querySelector('.contact_button')
	formBtn.setAttribute('aria-hidden', 'true')
	logo.setAttribute('aria-hidden', 'true')	
	lightbox.focus()
	
	lightBoxTab(1)
	profilCardTab(-1)
	photosSectionTab(-1)
  
}

//Ferme la lightbox en desactivant ses element et en reactivant le overflow permettant le scroll
function lightboxClose() {
	let lightboxImg = document.querySelector('.lightbox-img')
	let lightboxVideo = document.querySelector('.lightbox-video')
	lightboxVideo.classList.add('lightbox-element-disable')
	lightboxImg.classList.add('lightbox-element-disable')
	lightbox.classList.add('lightbox-modal-disable')
	document.body.style.overflow = 'auto'
	let lastLighboxElement = document.querySelector('.lightbox-img').getAttribute('name')
	let medias = document.getElementsByClassName('media')
	for (let i = 0; i < medias.length; i++) {
		if (medias[i].getAttribute('name') === lastLighboxElement) {
			medias[i].focus()
		}
	}
	lightBoxTab(-1)
	profilCardTab(1)
	photosSectionTab(1)
}

//Fonction appelée lors du clique sur la fleche de gauche de la lightbox permettant de passer à l'élement precédent
function previousMedia() {
//LightboxSliding(next ou previous, element cliqué)
	lightboxSliding('previous')
} 

//Fonction appelée lors du clique sur la fleche de droite de la lightbox permettant de passer à l'élement suivant
function nextMedia() {
	lightboxSliding('next')
} 

let prevFilterIndex
let actualFilterIndex

document.onkeydown = checkKey

//Touches de clavier associées aux éléments lightbox 
function checkKey(e) {
	e = e || window.event

	//flèche gauche
	if (e.keyCode == '37') {
    	lightboxSliding('previous')
	//Flèche droite
	} else if (e.keyCode == '39') {
    	lightboxSliding('next')
	//Echap
	} else if ((e.keyCode == '27')) {
		//Formulaire
		if (modalContainer.style.display == 'flex') {
			closeModal()
		//Slides
		} else if (!lightbox.classList.contains('lightbox-modal-disable')) {
			lightboxClose()
		} 
	} else if (e.keyCode == '38' && filterDropDown === document.activeElement) {
		prevFilterIndex = filterDropDown.selectedIndex
		actualFilterIndex = prevFilterIndex - 1
		if (actualFilterIndex < 0) actualFilterIndex = 0
		filter(actualFilterIndex)	
	} else if (e.keyCode == '40' && filterDropDown === document.activeElement) {
		prevFilterIndex = filterDropDown.selectedIndex
		actualFilterIndex = prevFilterIndex + 1
		if (actualFilterIndex == filterDropDown.length) actualFilterIndex = filterDropDown.length -1
		filter(actualFilterIndex)
	}
}



//Fonction changeant l'élement de la lightbox en fonction de souhait d'avoir la precedante ou la suivante
function lightboxSliding(direction) {
	//DOM Elements
	let lightboxImg = document.querySelector('.lightbox-img')
	let lightboxVideo = document.querySelector('.lightbox-video')
	let lightboxTitle = document.querySelector('.lightbox-title')

	//Variables
	let actualElement
	let nextElement

	
	if(lightboxImg.classList.contains('lightbox-element-disable')){
		let actualVideoName = document.querySelector('.lightbox-video').getAttribute('name')
		actualElement = mediasElements.namedItem(actualVideoName)
	} else {
		let actualImgName = document.querySelector('.lightbox-img').getAttribute('name')
		actualElement = mediasElements.namedItem(actualImgName)
	
	}
	


	//Direction == 'next' correspond au next appelé dans la fonction nextMedia et 'previous' l'inverse. En fonction du sens souhaité on navigue dans le tableau media grace à la propriété nextSibling ou previousSibling
	if (direction == 'next') {
		nextElement = actualElement.parentNode.parentNode.nextSibling.childNodes[0].childNodes[0]
	} else {
		nextElement = actualElement.parentNode.parentNode.previousSibling.childNodes[0].childNodes[0]
	}
		
	// On récupère le nom et le src de l'élément suivant  à afficher
	let nextElementName = nextElement.getAttribute('name') 
	let nextElementSrc = nextElement.src

	// En fonction de si l'élement à afficher est une img ou une video (grace à la fonction control des videos) faire apparaitre le bon receptacle
	if(nextElement.classList.contains('videoElement')) {
		lightboxImg.classList.add('lightbox-element-disable')
		lightboxVideo.classList.remove('lightbox-element-disable')
		lightboxVideo.setAttribute('src', nextElementSrc)
		lightboxVideo.setAttribute('name', nextElementName)
		lightboxVideo.setAttribute('controls', 'controls')
		lightboxVideo.setAttribute('tabindex', '1')
	} else {
		lightboxVideo.classList.add('lightbox-element-disable')
		lightboxImg.classList.remove('lightbox-element-disable')
		lightboxImg.setAttribute('src', nextElementSrc)
		lightboxImg.setAttribute('name', nextElementName)
		lightboxImg.setAttribute('tabindex', '1')
	} 
	// Mise à jour du texte correspondant à l'élément
	lightboxTitle.textContent = nextElementName
}



//Filtre
// DOM Elements
const popularityFilter = document.querySelector('.filter-popularity')
const dateFilter = document.querySelector('.filter-date')
const titleFilter = document.querySelector('.filter-title')

console.log(titleFilter)

//Ecoute du clique sur les filtres
/* function titleFilterEvent() { titleFilter.addEventListener('click', filter(0)) }
function popularityFilterEvent() { popularityFilter.addEventListener('click', filter(1)) }
function dateFilterEvent() { dateFilter.addEventListener('click', filter(2))} */

	
titleFilter.addEventListener('click', titleIndex)
popularityFilter.addEventListener('click', popularityIndex)
dateFilter.addEventListener('click', dateIndex)

function popularityIndex() { filter(0) }

function dateIndex() { filter(1) }

function titleIndex() { filter(2) }

function filter(filterindex) {
	let cardsPhoto = document.querySelectorAll('.card-photo')

	let elements
		
	// Triage en fonction du filtre choisi
	// Index 0 : popularite - Index 1 : date - Index 2 : titre
	if(filterindex == 0) {
		//HTMLCollection -> Array
		elements = [].slice.call(cardsPhoto)
		console.log(elements[0].childNodes[1].childNodes[1].childNodes[0].textContent);
		//Triage par nombre de like croissant
		elements.sort(function (a, b) { return a.childNodes[1].childNodes[1].childNodes[0].textContent - b.childNodes[1].childNodes[1].childNodes[0].textContent})
		//Inversion des elements afin d'avoir le triage en ordre decroissant
		elements.reverse()
	} else if (filterindex == 1) {
		elements = [].slice.call(mediasElements)
		console.log(elements[0].dataset.date.split('-'))
		//Triage par ordre croissant des dates 
		elements.sort(function (a, b) { return new Date(a.dataset.date.split('-')).getTime() - new Date(b.dataset.date.split('-')).getTime()})
		//Inversion des elements afin d'avoir le triage en ordre decroissant
		elements.reverse()
	} else if (filterindex == 2) {
		elements = [].slice.call(mediasElements)
		//Triage par ordre alphabétique
		elements.sort((a, b) => (a.getAttribute('name') > b.getAttribute('name')) ? 1 : -1) 
	} 
		
	//Suppression des photos présents avant le filtrage
	for(let i = 0; i < cardsPhoto.length; i++) cardsPhoto[i].remove()
		
	//Créations des nouvelles cartes
	elements.forEach((media) => {
		// target = localisation de l'élément img ou video
		let target
		if(filterindex == 2 || filterindex == 1) {
			target = media
		} else if (filterindex == 0) {
			target = media.childNodes[0].childNodes[0]
		}

		let mediasSection = document.querySelector('.cards-photo')
		let cardElement = document.createElement('div')
		let cardElementContainer = document.createElement('div')
		let cardElementBottom = document.createElement('div')
		let cardElementTitle = document.createElement('div')
		let cardElementLikeSection = document.createElement('div')
		let cardElementNew
		let newLike

		cardElement.classList.add('card-photo')
		cardElementContainer.classList.add('card-photo-container')
		cardElementBottom.classList.add('card-photo-bottom')
		cardElementTitle.classList.add('card-photo-title')
		cardElementLikeSection.classList.add('like-photo')
		cardElementTitle.textContent = target.getAttribute('name')
			
		if (target.classList.contains('videoElement'))
		{
			cardElementNew = document.createElement('video')
			cardElementNew.classList.add('videoElement')
		} else {
			cardElementNew = document.createElement('img') 
		}

		newLike = target.parentNode.parentNode.childNodes[1].childNodes[1].textContent

		cardElementNew.classList.add('media')
		cardElementNew.setAttribute('src', target.src)
		cardElementNew.setAttribute('name', target.getAttribute('name'))
		cardElementNew.setAttribute('alt', target.getAttribute('name'))
		cardElementNew.setAttribute('id', target.getAttribute('name'))
		cardElementNew.setAttribute('data-date', target.dataset.date)
		cardElementLikeSection.setAttribute('aria-label', 'likes')
		cardElementLikeSection.innerHTML = `<span class="like-local-number">${newLike}</span><i class="fas fa-heart fa-lg like-heart heart"></i>`

		cardElement.appendChild(cardElementContainer)
		cardElement.appendChild(cardElementBottom)
		cardElementBottom.appendChild(cardElementTitle)
		cardElementBottom.appendChild(cardElementLikeSection)
		cardElementContainer.appendChild(cardElementNew)
		mediasSection.appendChild(cardElement)
	})

	//Actualisation de la localisation et des events
	heartEvent()
	mediasElementsEvent()
	mediasElementsTabEvent() 
}




function displayModal() {
	modalContainer.style.display = 'flex'

	document.getElementById('main').setAttribute('tabindex', '-1')
	document.getElementById('main').setAttribute('aria-hidden', 'true')
	modal.setAttribute('aria-hidden', 'false')
	modal.focus()

	profilCardTab(-1)
	photosSectionTab(-1)
	filterDropDown.setAttribute('tabindex', '-1')
}
    
function closeModal() { 
	modalContainer.style.display = 'none' 

	document.getElementById('main').setAttribute('tabindex', '0')
	document.getElementById('main').setAttribute('aria-hidden', 'false')
	modal.setAttribute('aria-hidden', 'true')
	modal.focus()
	profilCardTab(1)
	photosSectionTab(1)
	let medias = document.getElementsByClassName('media')
	let mediasArray = [].slice.call(medias)
	mediasArray.forEach(element => {
		element.setAttribute('tabindex', '0')
	})
}


function profilCardTab(tabindexNumber) {
	let formBtn = document.getElementById('photograph_button')
	let cardName = document.querySelector('.photographer-name')
	let cardInfosDiv = document.querySelector('.infosDiv')
	let cardPhoto = document.querySelector('.img-div')

	formBtn.setAttribute('tabindex', tabindexNumber)
	cardName.setAttribute('tabindex', tabindexNumber)
	cardInfosDiv.setAttribute('tabindex', tabindexNumber)
	cardPhoto.setAttribute('tabindex', tabindexNumber)
	logo.setAttribute('tabindex', tabindexNumber)
	header.setAttribute('tabindex', tabindexNumber)
	filterLabel.setAttribute('tabindex', tabindexNumber)
	likeNPrice.setAttribute('tabindex', tabindexNumber)
}

function photosSectionTab(tabindexNumber) {
	let likesPhotos = document.querySelectorAll('.like-photo')
	let titlesPhotos = document.querySelectorAll('.card-photo-title')
	let medias = document.getElementsByClassName('media')
	let mediasArray = [].slice.call(medias)

	mediasArray.forEach(element => { element.setAttribute('tabindex', tabindexNumber) })
	likesPhotos.forEach(element => { element.setAttribute('tabindex', tabindexNumber) })
	titlesPhotos.forEach(element => { element.setAttribute('tabindex', tabindexNumber)
	})
}

function lightBoxTab(tabindexNumber) {
	let lightboxTitle = document.querySelector('.lightbox-title')
	lightbox.setAttribute('tabindex', tabindexNumber)
	lightboxCrossBtn.setAttribute('tabindex', tabindexNumber)
	lightboxPrev.setAttribute('tabindex', tabindexNumber)
	lightboxNext.setAttribute('tabindex', tabindexNumber)
	lightboxTitle.setAttribute('tabindex', tabindexNumber)
}


function filterTab(tabindexNumber) {
	filterDropDown.setAttribute('tabindex', tabindexNumber)
}