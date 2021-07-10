const path = require("path");
const osu = require("node-os-utils");
const os = osu.os;
const cpu = osu.cpu;
const mem = osu.mem;
const cpuUsage = document.getElementById("cpuUsage");
const cpuFree = document.getElementById("cpuFree");
const cpuName = document.getElementById("cpuName");
const computerName = document.getElementById("computerName");
const osName = document.getElementById("osName");
const systemUptime = document.getElementById("systemUptime");
const systemMemory = document.getElementById("systemMemory");
const cpuRange = document.getElementById("cpuRange");
const rangeWidth = document.getElementById("rangeWidth");

console.log(cpu);
console.log(mem);
console.log(os);
let selectedPage = "cpu";
let cpuOverLoad = "80"

//! Turning Seconds to DAY, Hour,...
const secToTime = (sec) => {
  sec = +sec;
  const day = Math.floor(sec / (3600 * 24));
  const hour = Math.floor((sec % (3600 * 24)) / 3600);
  const minute = Math.floor((sec % 3600) / 60);
  const second = Math.floor(sec % 60);
  return `${day} day, ${hour} hour, ${minute} minute, ${second} second`;
};


//! Notification
const notifyUser = (data) => {
  new Notification(data.title,data)
}

notifyUser({title:"CPU Overload",body:`CPU Overload Warning at ${cpuOverLoad}`,
icon:path.join(__dirname,"../assets/icons","icon.png")})

//! Static INFO
cpuName.innerText = cpu.model();
computerName.innerText = os.hostname();
osName.innerText = `${os.type()} ${os.arch()}`;
mem.info().then((data) => (systemMemory.innerText = data.totalMemMb));

//! Dynamic Info
setInterval(() => {
  cpu.usage().then((data) => {
    cpuUsage.innerText = data + "%";
    rangeWidth.style.width = data + "%";
    if(data > cpuOverLoad) {
      rangeWidth.style.backgroundColor = "red"
    }else{
      rangeWidth.style.backgroundColor = "rgb(49, 192, 125)"

    }
  });
  cpu.free().then((data) => (cpuFree.innerText = data + "%"));
  systemUptime.innerText = secToTime(os.uptime());
}, 1700);

//! STYLING
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
