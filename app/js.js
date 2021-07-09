let selectedPage = "cpu";

document.getElementById(selectedPage).style.display = "block";
const green = "rgb(49, 192, 125)";
const white = "#fff";

const cpuSection = document.getElementById("cpu");
const cpuHandler = document.getElementById("micro-chip-section");

const infoSection = document.getElementById("info");
const infoHandler = document.getElementById("info-section");

const settingsSection = document.getElementById("settings");
const settingsHandler = document.getElementById("setting-section");

//! Tab color default
cpuHandler.style.color = green;

cpuHandler.addEventListener("click", () => {
  //* changing tab colors
  cpuHandler.style.color = green;
  infoHandler.style.color = white;
  settingsHandler.style.color = white;

  //* changing what to show
  settingsSection.style.display = "none";
  infoSection.style.display = "none";
  cpuSection.style.display = "block";
});

infoHandler.addEventListener("click", () => {
  //* changing tab colors
  cpuHandler.style.color = white;
  infoHandler.style.color = green;
  settingsHandler.style.color = white;
  //* changing what to show
  settingsSection.style.display = "none";
  cpuSection.style.display = "none";
  infoSection.style.display = "block";
});

settingsHandler.addEventListener("click", () => {
  //* changing tab colors
  cpuHandler.style.color = white;
  infoHandler.style.color = white;
  settingsHandler.style.color = green;
  //* changing what to show
  cpuSection.style.display = "none";
  infoSection.style.display = "none";
  settingsSection.style.display = "block";
});
