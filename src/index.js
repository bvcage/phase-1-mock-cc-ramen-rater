const URL = 'http://localhost:3000/ramens';
const NO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

const menu = document.querySelector('#ramen-menu');
const details = document.querySelector('#ramen-detail');

const newEntryForm = document.querySelector('#new-ramen');
const updateForm = document.querySelector('#edit-ramen');
const deleteForm = document.querySelector('#delete-ramen');

window.addEventListener('DOMContentLoaded', () => {

    populateMenu();

    newEntryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        postNewRamen(event.target);
    });

    updateForm.addEventListener('submit', (event) => {
        event.preventDefault();
        patchExistingRamen(event.target);
    });
    
    deleteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // only delete if user types delete
        const userConfirm = event.target.querySelector('#delete-confirm');
        if (userConfirm.value.toUpperCase() === 'DELETE') {
            deleteRamen(event.target);
        } else {
            userConfirm.value = "type 'DELETE' to confirm";
            userConfirm.addEventListener('mousedown', () => userConfirm.value = '');
        }
    });

});

function populateMenu () {
    fetch (URL)
    .then (response => response.json())
    .then (data => {
        menu.innerHTML = '';            // clear any existing menu items
        displayRamenImages(data);       // display menu images at top
        displayRamenDetails(data[0]);   // default display details of first entry
    });
}

function displayRamenImages (ramenAry) {
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
        populateUpdateForm(ramenEntry);
        populateDeleteForm(ramenEntry);
    });
}

function populateUpdateForm (ramenEntry) {
    const idField = updateForm.querySelector('#ramen-id');
    const ratingField = updateForm.querySelector('#new-rating');
    const commentField = updateForm.querySelector('#new-comment');

    ratingField.style.color = 'rgb(186, 186, 186)';
    commentField.style.color = 'rgb(186, 186, 186)';

    ratingField.addEventListener('mousedown', () => event.target.style.color = 'black');
    commentField.addEventListener('mousedown', () => event.target.style.color = 'black');

    idField.value = ramenEntry.id;
    ratingField.value = ramenEntry.rating;
    commentField.value = ramenEntry.comment;
}

function populateDeleteForm (ramenEntry) {
    const idField = deleteForm.querySelector('#ramen-id');
    const userConfirm = deleteForm.querySelector('#delete-confirm');

    idField.value = ramenEntry.id;
    userConfirm.value = '';
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
        displayRamenDetails(newEntry);
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

function patchExistingRamen (updateRamenForm) {
    const ramenId = updateRamenForm.querySelector('#ramen-id').value;

    const ratingField = updateRamenForm.querySelector('#new-rating');
    const commentField = updateRamenForm.querySelector('#new-comment');

    const ramenEntryUpdate = {
        "rating" : ratingField.value,
        "comment" : commentField.value
    }

    const patchRamenUpdate = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(ramenEntryUpdate)
    }

    fetch (`${URL}/${ramenId}`, patchRamenUpdate)
    .then (response => response.json())
    .then (updatedRamen => {
        displayRamenDetails(updatedRamen);  // update details display
        populateUpdateForm(updatedRamen);   // update prepopulated form
    });
}

function deleteRamen (deleteRamenForm) {
    const ramenId = deleteRamenForm.querySelector('#ramen-id').value;
    
    fetch (`${URL}/${ramenId}`, {method: 'DELETE'})
    .then ((deletedRamen) => {
        populateMenu();
    });
}

function checkImgSrc (source) {
    if (source.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/) == null) {
        source = NO_IMAGE;
    }
    return source;
}