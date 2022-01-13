function mediaFactory(data) {
    const { id, photographerId, title, image, video, likes, date, price } = data

    const photographerName = document.querySelector('.photographer-name').innerText

    

    const photographerFirstName = photographerName.substring(0, photographerName.indexOf(' ')).replace('-', ' ')

    


    const imageAsset = `assets/media/${photographerFirstName}/${image}`
    const videoAsset = `assets/media/${photographerFirstName}/${video}`

  
    //Get id in Url----------------------------------------------------------------------

    //Get parameters after the ? include inthe url
    const queryString = window.location.search 
    //Parse the query string parameters
    const urlParams = new URLSearchParams(queryString)
    //get the id parameter 
    const idSearch = urlParams.get('id')

  

    //-----------------------------------------------------------------------------------

    

    function getImageCardDOM() {
        const cardPhoto = document.createElement('div')
        const cardPhotoContainer = document.createElement('div')
        const cardPhotoBottom = document.createElement('div')
        const cardPhotoTitle = document.createElement('div')
        const cardPhotoLikeSection = document.createElement('div')

        

        cardPhoto.classList.add('card-photo')
        cardPhotoContainer.classList.add('card-photo-container')
        cardPhotoBottom.classList.add('card-photo-bottom')
        cardPhotoTitle.classList.add('card-photo-title')
        cardPhotoLikeSection.classList.add('like-photo')
        

        cardPhotoTitle.textContent = title
        cardPhotoLikeSection.innerHTML = '<span class="like-local-number">0</span><i class="fas fa-heart fa-lg like-heart heart"></i>'

        cardPhoto.appendChild(cardPhotoContainer)
        cardPhoto.appendChild(cardPhotoBottom)
        cardPhotoBottom.appendChild(cardPhotoTitle)
        cardPhotoBottom.appendChild(cardPhotoLikeSection)

   
        
        
        if (video == undefined) {
            const cardPhotoImg = document.createElement('img')
            cardPhotoImg.setAttribute('src', imageAsset)
            cardPhotoImg.classList.add('media')
            cardPhotoImg.setAttribute('name', title)
            cardPhotoContainer.appendChild(cardPhotoImg)
        } else if (image == undefined) {
            const cardPhotoImg = document.createElement('video')
            cardPhotoImg.setAttribute('src', videoAsset)
            cardPhotoImg.setAttribute('controls', 'controls')
            cardPhotoImg.classList.add('media')
            cardPhotoImg.setAttribute('name', title)
            cardPhotoContainer.appendChild(cardPhotoImg)

        } 

        return(cardPhoto)

    } return { id, photographerId, title, image, video, likes, date, price, getImageCardDOM }



    
} 


