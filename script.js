// script.js

const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2Mbay1-b4cCmb6dMT8yVAPEI8HApC25epWiqQIk1_43FcSlOfvucowCkVfS_wxX0PWtBgETb17Pk0/pub?output=csv';

function init() {
  Papa.parse(sheetURL, {
    download: true,
    header: true,
    complete: function(results) {
      const cleanData = results.data.map(item => {
        const cleaned = {};
        Object.keys(item).forEach(key => {
          cleaned[key.trim()] = item[key];
        });
        return cleaned;
      });
      showData(cleanData);
    }
  });
}

function showData(data) {
  const cardContainer = document.getElementById('cardView');
  const categorySet = new Set();

  data.forEach(item => {
    const category = item.Region?.trim() || 'Uncategorized';
    categorySet.add(category);

    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.category = category;

    card.innerHTML = `
      <h3>${item.Organization}</h3>
      <p><strong>City:</strong> ${item.City}</p>
      <p><strong>County:</strong> ${item.County}</p>
      <p>${item.About}</p>
      <p><a href="${item.OrgURL}" target="_blank">Visit Website</a></p>
    `;

    cardContainer.appendChild(card);
  });

  // Populate filter dropdown
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
      card.style.display = selected === '' || card.dataset.category === selected ? 'block' : 'none';
    });
  });

  // Map view
  const map = L.map('mapView').setView([43.5, -89.6], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  data.forEach(item => {
    if (item.latitude && item.longitude) {
      const lat = parseFloat(item.latitude);
      const lng = parseFloat(item.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`<strong>${item.Organization}</strong><br>${item.City}, ${item.County}`);
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', init);
