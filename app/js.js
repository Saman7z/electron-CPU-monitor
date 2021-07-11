const path = require("path");
const osu = require("node-os-utils");
const os = osu.os;
const cpu = osu.cpu;
const mem = osu.mem;
const {ipcRenderer} = require("electron")
const cpuUsage = document.getElementById("cpuUsage");
const cpuFree = document.getElementById("cpuFree");
const cpuName = document.getElementById("cpuName");
const computerName = document.getElementById("computerName");
const osName = document.getElementById("osName");
const systemUptime = document.getElementById("systemUptime");
const systemMemory = document.getElementById("systemMemory");
const cpuRange = document.getElementById("cpuRange");
const rangeWidth = document.getElementById("rangeWidth");

// console.log(cpu);
// console.log(mem);
// console.log(os);

//! GET defaults settings from main

let cpuOverLoad 
let alertFrequeny 
let selectedPage = "cpu";

ipcRenderer.on("settings:get", (e, settings) => {
 document.getElementById("cpuOverload").value = settings.cpuOverload
 document.getElementById("alertFrequency").value = settings.alertFrequency

cpuOverLoad = +settings.cpuOverload
  alertFrequeny = +settings.alertFrequency
})

//! SET settings to main
document.getElementById("saveSettingsBtn").addEventListener("click", () => {
  const cpuOverload = document.getElementById("cpuOverload").value
  const alertFrequency = document.getElementById("alertFrequency").value
  if(cpuOverload.trim().length > 0 && alertFrequency.trim().length > 0) {
    ipcRenderer.send("settings:set", {
      cpuOverload,alertFrequency
    })
    alert("Limits Saved!")
  }else{
    alert("please enter the limits in order to save")
  }
})


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

// notifyUser({title:"CPU Overload",body:`CPU Overload Warning at ${cpuOverLoad}%`,
// icon:path.join(__dirname,"../assets/icons","icon.png")})
//! Set the cpu over load thumb to the right place
cpuRange.value = cpuOverLoad

//! RUN Notify (how much time passed since the last notification)
const runNotify = (frequency) => {

  if(localStorage.getItem("lastNotify") === null) {
    localStorage.setItem("lastNotify", new Date())
    return true
  }
  const notifyTime = new Date(parseInt(localStorage.getItem("lastNotify")))
  const now = new Date()
  const diffTime = Math.abs(now - notifyTime)
  const minutePassed = Math.ceil(diffTime/(1000*60))
  if(minutePassed > frequency) {
    return true
  }else{
    return false
  }
}

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

    //! Check overload based on local storage last time alert frequency
    if(data > cpuOverLoad && runNotify(alertFrequeny)) {
      notifyUser({title:"CPU Overload",body:`CPU Overload Warning at ${cpuOverLoad}`,
      icon:path.join(__dirname,"../assets/icons","icon.png")})
      localStorage.setItem("lastNotify", +new Date())
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
