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
        menu.append(menuEntryImg);
    })
}