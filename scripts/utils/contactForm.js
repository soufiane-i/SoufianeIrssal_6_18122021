const modalContainer = document.getElementById('contact_modal')
const modal = document.querySelector('.modal')
const firstName = document.getElementById('firstname')
const lastName = document.getElementById('lastname')
const email = document.getElementById('email')
const message = document.getElementById('message')
const champs = document.querySelectorAll('.form-champ')
const submitBtn = document.querySelector('.contact_button')
const filterDropDown = document.getElementById('filters-dropdown')
const header = document.querySelector('header')

const logo = document.querySelector('.logo')




let firstNameRegex = /^[a-z-]{2,}$/i
let lastNameRegex = /^[a-z ,.'-]{2,}$/i
let messageRegex = /^[a-z ,.'-]{0,}$/i
let emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/


// variables
let formDataArray = []


// form submit event 
submitBtn.addEventListener('click', submitFunct)


//submit function
function submitFunct(e){

	// Function which display error message
	firstNameCheck()
	lastNameCheck()
	emailCheck()
	messageCheck()
	console.log(formDataArray.length)
	console.log(champs.length)
	//---------------------------------
	// if number of valid form input are equal to the total number of input form e.g if all input are valid
	if (formDataArray.length == champs.length) {    
		// Function which reset the form if it was send           
		submitClear()                                            
		modalContainer.style.display = 'none'
	}
  	// refresh array which count valid input number
	formDataArray = []       
	// Don't refresh page                                  
	e.preventDefault()                                        
  
    
}

// function which clear form after submit success
function submitClear(){
	console.log('Formulaire envoyé')
	firstName.classList.remove('form-champ-error')
	for(let i = 0; i<champs.length; i++){  // loop which clear form inputs 
		champs[i].value = ''
	}

 
}
  
  
function firstNameCheck() {
	// Trim() delete blank space around unnecessary + check if prenom input match with prenom regex
	if (firstNameRegex.test(firstName.value.trim())) {            
		formDataArray.push('check') 
		// add 'check' in formDataArray array to count how many input forms are valid
		firstName.classList.remove('form-champ-error')
		console.log(firstName.value)             
     
	} else {
		firstName.classList.add('form-champ-error')
	}
}
  
function lastNameCheck() {
	if (lastNameRegex.test(lastName.value.trim())) {
		formDataArray.push('check')
		lastName.classList.remove('form-champ-error')
		console.log(lastName.value) 
	} else {
		lastName.classList.add('form-champ-error')
	}
}
  
  
function emailCheck() {
	if (emailRegex.test(email.value.trim())) {
		formDataArray.push('check')
		email.classList.remove('form-champ-error')
		console.log(email.value) 
	} else {
		email.classList.add('form-champ-error')
      
	}
}

function messageCheck() {
	if (messageRegex.test(message.value.trim())) {
		formDataArray.push('check')
		message.classList.remove('form-champ-error')
		console.log(message.value) 
	} else {
		message.classList.add('form-champ-error')
	}
}

function displayModal() {
	modalContainer.style.display = 'flex'
	document.getElementById('main').setAttribute('tabindex', '-1')
	document.getElementById('main').setAttribute('aria-hidden', 'true')
	modal.setAttribute('aria-hidden', 'false')
	modal.focus()
	
	let medias = document.getElementsByClassName('media')
	let mediasArray = [].slice.call(medias)
	mediasArray.forEach(element => {
		element.setAttribute('tabindex', '-1')
	})
	let formBtn = document.getElementById('photograph_button')
	filterDropDown.setAttribute('tabindex', '-1')
	formBtn.setAttribute('tabindex', '-1')
	logo.setAttribute('tabindex', '-1')
	header.setAttribute('tabindex', '-1')
}
    
function closeModal() {   
	document.getElementById('main').setAttribute('tabindex', '0')
	document.getElementById('main').setAttribute('aria-hidden', 'false')
	modal.setAttribute('aria-hidden', 'true')
	modal.focus()
	
	let medias = document.getElementsByClassName('media')
	let mediasArray = [].slice.call(medias)
	mediasArray.forEach(element => {
		element.setAttribute('tabindex', '0')
	})
	modalContainer.style.display = 'none'
	let formBtn = document.getElementById('photograph_button')
	filterDropDown.setAttribute('tabindex', '0')
	formBtn.setAttribute('tabindex', '0')
	logo.setAttribute('tabindex', '0')
	header.setAttribute('tabindex', '0')
}


document.onkeydown = checkKey

//Touches de clavier associées aux éléments lightbox 
function checkKey(e) {
	e = e || window.event

	if (e.keyCode == '27') {
		closeModal()
	}
}