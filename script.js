// script.js
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2Mbay1-b4cCmb6dMT8yVAPEI8HApC25epWiqQIk1_43FcSlOfvucowCkVfS_wxX0PWtBgETb17Pk0/pub?output=csv';

function init() {
  Papa.parse(sheetURL, {
    download: true,
    header: true,
    complete: function(results) {
      showData(results.data);
    }
  });
}

function showData(data) {
  const cardContainer = document.getElementById('cardView');
  const categorySet = new Set();

  data.forEach(item => {
    categorySet.add(item.Category);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${item.Name}</h3>
      <p>${item.Description}</p>
      <img src="${item.ImageURL}" alt="${item.Name}" />
    `;
    cardContainer.appendChild(card);
  });

  const filter = document.getElementById('categoryFilter');
  categorySet.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  filter.addEventListener('change', () => {
    const selected = filter.value;
    document.querySelectorAll('.card').forEach(card => {
      card.style.display = selected === '' || card.innerHTML.includes(selected) ? 'block' : 'none';
    });
  });

  const map = L.map('mapView').setView([45, -93], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  data.forEach(item => {
    if (item.Latitude && item.Longitude) {
      L.marker([item.Latitude, item.Longitude])
        .addTo(map)
        .bindPopup(`<strong>${item.Name}</strong><br>${item.Description}`);
    }
  });
}

window.addEventListener('DOMContentLoaded', init);
