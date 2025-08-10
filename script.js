const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2Mbay1-b4cCmb6dMT8yVAPEI8HApC25epWiqQIk1_43FcSlOfvucowCkVfS_wxX0PWtBgETb17Pk0/pub?output=csv";

let data = [];
let map;
let markers = [];

const cardView = document.getElementById("cardView");
const mapView = document.getElementById("mapView");
const cardViewBtn = document.getElementById("cardViewBtn");
const mapViewBtn = document.getElementById("mapViewBtn");
const regionFilter = document.getElementById("regionFilter");
const countyFilter = document.getElementById("countyFilter");

cardViewBtn.onclick = () => {
  cardView.classList.remove("hidden");
  mapView.classList.add("hidden");
};

mapViewBtn.onclick = () => {
  mapView.classList.remove("hidden");
  cardView.classList.add("hidden");
  if (!map) initMap();
};

function initMap() {
  map = L.map("map").setView([44.5, -89.5], 7);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);
}

function renderCards(filteredData) {
  cardView.innerHTML = "";
  filteredData.forEach(org => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3><a href="${org.OrgURL}" target="_blank">${org.Organization}</a></h3>
      <p><strong>Region:</strong> ${org.Region}</p>
      <p><strong>County:</strong> ${org.County}</p>
      <p>${org.About}</p>
    `;
    cardView.appendChild(card);
  });
}

function populateFilters() {
  const regions = [...new Set(data.map(d => d.Region).filter(Boolean))];
  const counties = [...new Set(data.map(d => d.County).filter(Boolean))];

  regions.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    regionFilter.appendChild(opt);
  });

  counties.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    countyFilter.appendChild(opt);
  });
}

function applyFilters() {
  const region = regionFilter.value;
  const county = countyFilter.value;

  const filtered = data.filter(d => {
    return (region === "all" || d.Region === region) &&
           (county === "all" || d.County === county);
  });

  renderCards(filtered);
}

regionFilter.onchange = applyFilters;
countyFilter.onchange = applyFilters;

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: results => {
    data = results.data;
    populateFilters();
    renderCards(data);
  }
});



