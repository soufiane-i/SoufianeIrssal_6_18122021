async function getPhotographers() {
	// Penser à remplacer par les données récupérées dans le json
	let res = await fetch('/data/photographers.json')
	if (res.ok) {
		data = await res.json()
	} else {
		console.error('retour serveur : ', res.status)
	}

	// et bien retourner le tableau photographers seulement une fois

	return {
		photographers: [...data.photographers],
	}
}

async function displayData(photographers) {
	const photographersSection = document.querySelector('.photographer_section')

	photographers.forEach((photographer) => {
		const photographerModel = photographerFactory(photographer)
		const userCardDOM = photographerModel.getUserCardDOM()
		photographersSection.appendChild(userCardDOM)
	})
}

async function init() {
	// Récupère les datas des photographes
	const { photographers } = await getPhotographers()
	displayData(photographers)
}

init()

console.log(getPhotographers())

console.log(window.location.search)
