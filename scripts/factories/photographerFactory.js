function photographerFactory(data) {
	const { name, portrait, city, country, tagline, price, id } = data

	const photographerPortrait = `assets/media/Photographers ID Photos/${portrait}`


	//Get id in Url----------------------------------------------------------------------

	//Get parameters after the ? include inthe url
	const queryString = window.location.search 
	//Parse the query string parameters
	const urlParams = new URLSearchParams(queryString)
	//get the id parameter 
	const idSearch = urlParams.get('id')

	//------------------------------------------------------------------------------------

	if(urlParams.has('id')){
		getUserProfileDOM() 
		return { name, photographerPortrait, city, country, tagline, price, id, getUserProfileDOM }
	} else if(urlParams.has('id') == false) {
		getUserCardDOM()
		return { name, photographerPortrait, city, country, tagline, price, id, getUserCardDOM }
	}


	function getUserProfileDOM() {
		const contactName = document.querySelector('.contact-name')
		const photographerContent = document.createElement('div')
		const photographerProfile = document.createElement('div')
		const imgDiv = document.createElement('div')
		const photographerPhoto = document.createElement('img')
		const photographerBtn = document.createElement('div')
		const name = document.createElement('h2')
		const location = document.createElement('span')
		const tagLine = document.createElement('span')

		photographerContent.classList.add('photographer-content')
		photographerProfile.classList.add('photographer-profile')
		photographerBtn.classList.add('contact_button')
		name.classList.add('photographer-name')
		location.classList.add('photographer-city')
		tagLine.classList.add('photographer-tagline')
		imgDiv.classList.add('img-div')
		photographerBtn.innerHTML = '<button class="contact_button" onclick="displayModal()">Contactez-moi</button>'
		name.textContent = data.name
		location.textContent = data.city + ', ' + data.country
		tagLine.textContent = data.tagline
		photographerPhoto.setAttribute('src', photographerPortrait)
		photographerProfile.appendChild(name)
		photographerProfile.appendChild(location)
		photographerProfile.appendChild(tagLine)
		photographerContent.appendChild(photographerProfile)
		photographerContent.appendChild(photographerBtn)
		imgDiv.appendChild(photographerPhoto)
		photographerContent.appendChild(imgDiv)
		contactName.textContent = name
		return(photographerContent)

	}

	function getUserCardDOM() {
		const article = document.createElement( 'article' )
		const profileHeader = document.createElement('a')
		const img = document.createElement( 'img' )
		const h2 = document.createElement( 'h2' )
		const locationDiv = document.createElement( 'div' )
		const tagLineDiv = document.createElement('div')
		const priceDiv = document.createElement('div')
		profileHeader.setAttribute('href', `photographer.html?id=${id}`)
		profileHeader.setAttribute('aria-label', `profile de ${name}`)
		profileHeader.classList.add('profile-header')
		img.setAttribute('src', photographerPortrait)
		img.setAttribute('alt', name)
		h2.textContent = name
		locationDiv.classList = 'location'
		locationDiv.textContent = city + ', ' + country
		tagLineDiv.classList = 'tagLine'
		tagLineDiv.textContent = tagline
		priceDiv.classList ='price'
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


