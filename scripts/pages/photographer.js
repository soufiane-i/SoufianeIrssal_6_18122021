/* eslint-disable no-undef */
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

function displayMedias(mediasProp, heartEvent, mediasElementsEvent, titleFilterEvent, popularityFilterEvent, dateFilterEvent, dateFilterTest) {
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
	titleFilterEvent()
	popularityFilterEvent()
	dateFilterEvent()
	dateFilterTest()
}

//Activation des fonctions d'affichage de la carte de profil, du tarif journalier et des photos et video après avoir recceuilli les données Json
async function init() {
	// Récupère les datas des photographes et les associe à chaque fonctions dédiées
	const { photographer } = await getJsonElements('photographer')
	const { mediasProp } = await getJsonElements('medias')
	displayProfilCard(photographer)
	displayDailyPrice(photographer)
	displayMedias(mediasProp, heartEvent, mediasElementsEvent, mediasElementsTabEvent, titleFilterEvent, popularityFilterEvent, dateFilterEvent, dateFilterTest)
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

document.body.focus()

// Fonction appélée lors du clique sur un element dans la section media
function displayLightBox(e) {
	let key=e.keyCode || e.which
	// Detection du click et de la touche entrer
	if (key==13 || 'click'){
	   	//Manipulation du Aria-hidden pour la anavigation au clavier
		for(let i=0; i < mediasElements.length; i++) {
			mediasElements[i].setAttribute('aria-selected', 'false')
			mediasElements[i].setAttribute('aria-hidden', 'true')
		}
		

		
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
			} else {
				lightboxImg.setAttribute('name', targetMediasTitle)
				lightboxImg.classList.add('lightbox-img')
				lightboxImg.setAttribute('src', targetMediasSrc)
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
		lightboxCloseBtn.setAttribute('aria-hidden', 'false')
		lightboxPrev.setAttribute('aria-hidden', 'false')	
		lightboxNext.setAttribute('aria-hidden', 'false')
		let formBtn = document.querySelector('.contact_button')
		let bannerImg = document.querySelector('.banner-img')
		formBtn.setAttribute('aria-hidden', 'true')
		bannerImg.setAttribute('aria-hidden', 'true')	
		lightboxCrossBtn.focus()
	}
  
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
	lightboxSliding('previous', e, 'click')
} 

//Fonction appelée lors du clique sur la fleche de droite de la lightbox permettant de passer à l'élement suivant
function nextMedia(e) {
	lightboxSliding('next', e, 'click')
} 

document.onkeydown = checkKey

//Touches de clavier associées aux éléments lightbox 
function checkKey(e) {
	e = e || window.event

	//flèche gauche
	if (e.keyCode == '37') {
    	lightboxSliding('previous', lightboxPrev, 'press')
	//Flèche droite
	} else if (e.keyCode == '39') {
    	lightboxSliding('next', lightboxNext, 'press')
	//Echap
	} else if (e.keyCode == '27') {
    	lightboxClose()
		closeModal()
	}
}



//Fonction changeant l'élement de la lightbox en fonction de souhait d'avoir la precedante ou la suivante
function lightboxSliding(direction, arrow, controller) {
	//DOM Elements
	let lightboxImg = document.querySelector('.lightbox-img')
	let lightboxVideo = document.querySelector('.lightbox-video')
	let lightboxTitle = document.querySelector('.lightbox-title')

	//Variables
	let actualElement
	let nextElement

	//adaptation du paramètre arrow qui change selon le choix des flèche ou du clique
	if (controller == 'press') {
		// Récuperer l'élément du tableau mediasElements regroupant tout les medias à l'aide du name de l'élément dand la lightbox en fonction de sa nature d'img ou de video
		// Savoir si c'est une img ou une video grace à la classe 'lightbox-element-disable' permettant de savoir si l'img est caché ce qui voudrait dire que l'élement actuel est une video
		if(lightboxImg.classList.contains('lightbox-element-disable')){
			//A partir de la fleche sur laquelle on clique, on remonte au parent afin de retrouver l'enfant correspondant à l'img ou à la video sachant que les deux chemin sont différents
			let actualVideoName = arrow.parentNode.parentNode.parentNodechildNodes[3].childNodes[2].getAttribute('name')
			// Grace au name on cherche la photo correspondant dans le tableau media regroupant tout les element
			actualElement = mediasElements.namedItem(actualVideoName)
		} else {
			let actualImgName = arrow.parentNode.parentNode.childNodes[3].childNodes[1].getAttribute('name')
			actualElement = mediasElements.namedItem(actualImgName)
		}
	} else if (controller == 'click') {
		if(lightboxImg.classList.contains('lightbox-element-disable')){
			let actualVideoName = arrow.target.parentNode.parentNode.childNodes[3].childNodes[2].getAttribute('name')
			
			actualElement = mediasElements.namedItem(actualVideoName)
		} else {
			let actualImgName = arrow.target.parentNode.parentNode.childNodes[3].childNodes[1].getAttribute('name')
			actualElement = mediasElements.namedItem(actualImgName)
		}
	} 



	//Direction == 1 correspond au next appelé dans la fonction nextMedia et 0 l'inverse. En fonction du sens souhaité on navigue dans le tableau media grace à la propriété nextSibling ou previousSibling
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
	} else {
		lightboxVideo.classList.add('lightbox-element-disable')
		lightboxImg.classList.remove('lightbox-element-disable')
		lightboxImg.setAttribute('src', nextElementSrc)
		lightboxImg.setAttribute('name', nextElementName)
	} 
	// Mise à jour du texte correspondant à l'élément
	lightboxTitle.textContent = nextElementName
}



//Filtre
// DOM Elements
const popularityFilter = document.querySelector('.filter-popularity')
const dateFilter = document.querySelector('.filter-date')
const titleFilter = document.querySelector('.filter-title')

//Ecoute du clique sur les filtres
function titleFilterEvent() { titleFilter.addEventListener('click', filter) }
function popularityFilterEvent() { popularityFilter.addEventListener('click', filter) }
function dateFilterEvent() { dateFilter.addEventListener('click', filter)}
function dateFilterTest() { dateFilter.addEventListener('click', () => {
	
})}
function filter(e) {
	let cardsPhoto = document.querySelectorAll('.card-photo')

	let elements
	
	// Triage en fonction du filtre choisi
	if(e.target.value == 'Titre') {
		//HTMLCollection -> Array
		elements = [].slice.call(mediasElements)
		//Triage par ordre alphabétique
		elements.sort((a, b) => (a.getAttribute('name') > b.getAttribute('name')) ? 1 : -1) 
	} else if (e.target.value == 'Popularite') {
		elements = [].slice.call(cardsPhoto)
		//Triage par nombre de like croissant
		elements.sort(function (a, b) { return a.childNodes[1].childNodes[1].childNodes[0].textContent - b.childNodes[1].childNodes[1].childNodes[0].textContent})
		//Inversion des elements afin d'avoir le triage en ordre decroissant
		elements.reverse()
	} else if (e.target.value == 'Date') {
		elements = [].slice.call(mediasElements)
		//Triage par ordre croissant des dates 
		elements.sort(function (a, b) { return new Date(a.dataset.date).getTime() - new Date(b.dataset.date).getTime()})
		console.log(elements)
		//Inversion des elements afin d'avoir le triage en ordre decroissant
		elements.reverse()
	} 
    
	//Suppression des photos présents avant le filtrage
	for(let i = 0; i < cardsPhoto.length; i++) cardsPhoto[i].remove()
	
	//Créations des nouvelles cartes
	elements.forEach((media) => {
		// target = localisation de l'élément img ou video
		let target
		if(e.target.value == 'Titre' || e.target.value == 'Date') {
			target = media
		} else if (e.target.value == 'Popularite') {
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




