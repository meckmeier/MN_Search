const cardViewBtn = document.getElementById("cardViewBtn");
const mapViewBtn = document.getElementById("mapViewBtn");
const cardView = document.getElementById("cardView");
const mapView = document.getElementById("mapView");

cardViewBtn.addEventListener("click", () => {
  cardView.classList.remove("hidden");
  mapView.classList.add("hidden");
});

mapViewBtn.addEventListener("click", () => {
  mapView.classList.remove("hidden");
  cardView.classList.add("hidden");
});
