


const modal = document.getElementById('contact_modal')
const firstName = document.getElementById('firstname')
const lastName = document.getElementById('lastname')
const email = document.getElementById('email')
const message = document.getElementById('message')
const champs = document.querySelectorAll('.form-champ')
const submitBtn = document.querySelector('.contact_button')



let firstNameRegex = /^[a-z-]{2,}$/i
let lastNameRegex = /^[a-z ,.'-]{2,}$/i
let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/


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
    if (formDataArray.length == champs.length) {               // if number of valid form input are equal to the total number of input form e.g if all input are valid
      submitClear()                                            // Function which reset the form if it was send
      modal.style.display = 'none'
    }
  
    formDataArray = []                                         // refresh array which count valid input number
    e.preventDefault()                                         // Don't refresh page
  
    
}

  // function which clear form after submit success
function submitClear(){
    console.log('ok');
    for(let i = 0; i<champs.length; i++){  // loop which clear form inputs 
     champs[i].value = ''
    }

 
}
  
  
  function firstNameCheck() {
    if (firstNameRegex.test(firstName.value.trim())) {              // Trim() delete blank space around unnecessary + check if prenom input match with prenom regex
      formDataArray.push('check')                           // add 'check' in formDataArray array to count how many input forms are valid
     
    } else {
   

    }
  }
  
  function lastNameCheck() {
    if (lastNameRegex.test(lastName.value.trim())) {
      formDataArray.push('check')
    } else {
      
  
    }
  }
  
  
  function emailCheck() {
    if (emailRegex.test(email.value.trim())) {
      formDataArray.push('check')
    } else {

      
    }
    }

    function messageCheck() {
        if (lastNameRegex.test(message.value.trim())) {
          formDataArray.push('check')
        } else {
    
          
        }
    }

    function displayModal() {
    
        modal.style.display = 'block'
    }
    
    function closeModal() {
        
        modal.style.display = 'none'
    }