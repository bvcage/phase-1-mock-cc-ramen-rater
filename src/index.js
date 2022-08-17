const URL = 'http://localhost:3000/ramens';

window.addEventListener('DOMContentLoaded', () => {

    fetch (URL)
    .then (response => response.json())
    .then (data => {
        displayRamenImages(data);
    })

});

function displayRamenImages (ramenAry) {
    const menu = document.querySelector('#ramen-menu');
    ramenAry.forEach(ramen => {
        const menuEntryImg = document.createElement('img');
        menuEntryImg.src = ramen.image;
        menuEntryImg.id = ramen.id;
        menu.append(menuEntryImg);
        menuEntryImg.addEventListener('click', displayRamenDetails);
    });
}

function displayRamenDetails (event) {
    const ramenId = event.target.id;

    const details = document.querySelector('#ramen-detail');
    const ramenImg = details.querySelector('img.detail-image');
    const ramenName = details.querySelector('h2.name');
    const ramenRestaurant = details.querySelector('h3.restaurant');

    const ramenRating = document.querySelector('#rating-display');
    const ramenComment = document.querySelector('#comment-display');
    
    fetch (`${URL}/${ramenId}`)
    .then (response => response.json())
    .then (ramenEntry => {
        ramenImg.src = ramenEntry.image;
        ramenName.textContent = ramenEntry.name;
        ramenRestaurant.textContent = ramenEntry.ramenRestaurant;
        ramenRating.textContent = ramenEntry.rating;
        ramenComment.textContent = ramenEntry.comment;
    })
}