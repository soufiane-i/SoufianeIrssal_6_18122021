function photographerFactory(data) {
	const { name, portrait, city, country, tagline, price, id } = data

	//Recuperation de la photo de profil
	const photographerPortrait = `assets/media/Photographers ID Photos/${portrait}`

	//Récupération de l'id dans l'URL
	const queryString = window.location.search 
	const urlParams = new URLSearchParams(queryString)
	
	if(urlParams.has('id')){
		getUserProfileDOM() 
		return { name, photographerPortrait, city, country, tagline, price, id, getUserProfileDOM }
	} else if(urlParams.has('id') == false) {
		getIndexPhotographerCard()
		return { name, photographerPortrait, city, country, tagline, price, id, getIndexPhotographerCard }
	}

	function getUserProfileDOM() {
		const contactName = document.querySelector('.contact-name')
		const photographerContent = document.createElement('div')
		const photographerProfile = document.createElement('div')
		const imgDiv = document.createElement('div')
		const photographerPhoto = document.createElement('img')
		const photographerBtn = document.createElement('div')
		const h2 = document.createElement('h2')
		const location = document.createElement('span')
		const tagLine = document.createElement('span')

		photographerContent.classList.add('photographer-content')
		photographerProfile.classList.add('photographer-profile')
		photographerBtn.classList.add('contact_button')
		h2.classList.add('photographer-name')
		location.classList.add('photographer-city')
		tagLine.classList.add('photographer-tagline')
		imgDiv.classList.add('img-div')
		
		photographerBtn.innerHTML = '<button class="contact_button" onclick="displayModal()">Contactez-moi</button>'
		h2.textContent = data.name
		location.textContent = data.city + ', ' + data.country
		tagLine.textContent = data.tagline
		contactName.textContent = name

		photographerPhoto.setAttribute('src', photographerPortrait)
		photographerPhoto.setAttribute('alt', name)
		imgDiv.setAttribute('aria-label', name)

		photographerProfile.appendChild(h2)
		photographerProfile.appendChild(location)
		photographerProfile.appendChild(tagLine)
		photographerContent.appendChild(photographerProfile)
		photographerContent.appendChild(photographerBtn)
		imgDiv.appendChild(photographerPhoto)
		photographerContent.appendChild(imgDiv)

		return(photographerContent)
	}

	function getIndexPhotographerCard() {
		const article = document.createElement( 'article' )
		const profileHeader = document.createElement('a')
		const img = document.createElement( 'img' )
		const h2 = document.createElement( 'h2' )
		const locationDiv = document.createElement( 'div' )
		const tagLineDiv = document.createElement('div')
		const priceDiv = document.createElement('div')
		profileHeader.setAttribute('href', `photographer.html?id=${id}`)
		profileHeader.setAttribute('aria-label', `profile de ${name}`)
		img.setAttribute('src', photographerPortrait)
		img.setAttribute('alt', name)
		profileHeader.classList.add('profile-header')
		locationDiv.classList.add('location')
		priceDiv.classList.add('price')
		tagLineDiv.classList.add('tagLine')

		h2.textContent = name
		locationDiv.textContent = city + ', ' + country
		tagLineDiv.textContent = tagline
		priceDiv.textContent = price + '€/jour'

		article.appendChild(profileHeader)
		profileHeader.appendChild(img)
		profileHeader.appendChild(h2)
		article.appendChild(locationDiv)
		article.appendChild(tagLineDiv)
		article.appendChild(priceDiv)

		return (article)
	}
} 


