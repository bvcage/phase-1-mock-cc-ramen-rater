const URL = 'http://localhost:3000/ramens';
const NO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

window.addEventListener('DOMContentLoaded', () => {

    fetch (URL)
    .then (response => response.json())
    .then (data => {
        displayRamenImages(data);       // display menu images at top
        displayRamenDetails(data[0]); // default display details of first entry
    });

    const newEntryForm = document.querySelector('#new-ramen');
    newEntryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        postNewRamen(event.target);
    });

});

function displayRamenImages (ramenAry) {
    const menu = document.querySelector('#ramen-menu');
    ramenAry.forEach(ramen => {
        const menuEntryImg = document.createElement('img');
        menuEntryImg.src = checkImgSrc(ramen.image);
        menuEntryImg.id = ramen.id;
        menu.append(menuEntryImg);
        menuEntryImg.addEventListener('click', () => displayRamenDetails(event.target));
    });
}

function displayRamenDetails (ramenEntry) {
    const ramenId = ramenEntry.id;

    const details = document.querySelector('#ramen-detail');
    const ramenImg = details.querySelector('img.detail-image');
    const ramenName = details.querySelector('h2.name');
    const ramenRestaurant = details.querySelector('h3.restaurant');

    const ramenRating = document.querySelector('#rating-display');
    const ramenComment = document.querySelector('#comment-display');
    
    fetch (`${URL}/${ramenId}`)
    .then (response => response.json())
    .then (ramenEntry => {
        ramenImg.src = checkImgSrc(ramenEntry.image);
        ramenName.textContent = ramenEntry.name;
        ramenRestaurant.textContent = ramenEntry.restaurant;
        ramenRating.textContent = ramenEntry.rating;
        ramenComment.textContent = ramenEntry.comment;
    });
}

function postNewRamen (newRamenForm) {
    const nameField = newRamenForm.querySelector('#new-name');
    const restField = newRamenForm.querySelector('#new-restaurant');
    const imgField = newRamenForm.querySelector('#new-image');
    const ratingField = newRamenForm.querySelector('#new-rating');
    const commentField = newRamenForm.querySelector('#new-comment');

    const newRamenEntry = {
        "name" : nameField.value,
        "restaurant" : restField.value,
        "image" : imgField.value,
        "rating" : ratingField.value,
        "comment" : commentField.value
    }

    const newRamenPost = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newRamenEntry)
    }

    fetch (URL, newRamenPost)
    .then (response => response.json())
    .then (newEntry => {
        displayRamenImages([newEntry]);
        clearForm();
    });

    function clearForm () {
        nameField.value = '';
        restField.value = '';
        imgField.value = '';
        ratingField.value = '';
        commentField.value = '';
    }
}

function checkImgSrc (source) {
    if (source.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/) == null) {
        source = NO_IMAGE;
    }
    return source;
}