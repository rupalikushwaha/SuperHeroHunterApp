
// getting the list of heros stored in localstorage
let heroes = JSON.parse(localStorage.getItem("list"));  

// this cardcontainer will contain our hero card 
const showContainer = document.getElementsByClassName("display-container")[0];

// this carousle will displayed when we click on stories series comics and events
const carausel_inner = document.getElementsByClassName("carousel-inner")[0];
const carausel = document.getElementById("carouselExample");

// 
function flipcard(i) {  // - G
  document.getElementsByClassName("card-container")[i].classList.toggle("flipCard")
}

let ts = "1688549185455";
let publicKey = "36419ade44b2a052456e82ad6f7afe45";
let hashVal = "eacda864f7bd854132779d8660bfbb80";

// hashvalue is generated using ts + publickey + privateKey - G
const [timestamp, apiKey, hashValue] = [ts, publicKey, hashVal];

// custom notification fuction  -G
function showAlert(msg) {
  //alert placeholder is a div which appers when ever we generate notifications
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible bg-danger" role="alert">`,
      `   <div class="text-warning">${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
    let audio = new Audio("Sounds/Notifications.mp3");
    audio.play();
    setTimeout(()=>{
      audio.pause();
    },2000);
    alertPlaceholder.append(wrapper)
  }


  appendAlert(msg, 'success');

}

async function getComics(id) {
  // url for sending req
  const url = `https://gateway.marvel.com:443/v1/public/characters/${id}/comics?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`;
  // fetching response
  const response = await fetch(url);
  // changing response in json format
  const jsonData = await response.json();
  displayCarausel(jsonData, "Comics");
  console.log(jsonData);
}
async function getSeries(id) {
  // url for sending req
  const url = `https://gateway.marvel.com:443/v1/public/characters/${id}/series?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`;
  // fetching response
  const response = await fetch(url);
  // changing response in json format
  const jsonData = await response.json();
  displayCarausel(jsonData, "Series");
  console.log(jsonData);
}
async function getEvents(id) {
  // url for sending req
  const url = `https://gateway.marvel.com:443/v1/public/characters/${id}/events?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`;
  // fetching response
  const response = await fetch(url);
  // changing response in json format
  const jsonData = await response.json();
  displayCarausel(jsonData, "Events");
  console.log(jsonData);
}
async function getStories(id) {
  // url for sending req
  const url = `https://gateway.marvel.com:443/v1/public/characters/${id}/stories?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`;
  // fetching response
  const response = await fetch(url);
  // changing response in json format
  const jsonData = await response.json();
  displayCarausel(jsonData, "Stories");
  console.log(jsonData);
}


// function to display carausel
function displayCarausel(jsonData, sec) {
  console.log(jsonData);
  carausel_inner.innerHTML = "";
  if (jsonData.data["results"].length == 0) {
    return;
  }
  let activecreated = false;
  jsonData.data["results"].forEach((element) => {
    if (element.thumbnail != null) {
      let div = document.createElement("div");
      if (!activecreated) {
        div.setAttribute("class", "carousel-item active");
        activecreated = true;
      } else {
        div.setAttribute("class", "carousel-item");
      }
      let img = document.createElement("img")

      img.src = element.thumbnail["path"] + "." + element.thumbnail["extension"];
      div.appendChild(img);
      carausel_inner.appendChild(div);
    }else{
      let h = document.createElement("h2");
      // h.setAttribute("class","title");
      h.innerHTML = element.title;
      if (!activecreated) {
        h.setAttribute("class", "carousel-item title active");
        activecreated = true;
      } else {
        h.setAttribute("class", "carousel-item title");
      }
      carausel_inner.appendChild(h);
    }

  })
  document.getElementById("magzines").innerHTML = sec;

  carausel.style.display = "block"
}

document.getElementsByClassName("cl")[0].addEventListener("click",function(){
  carausel.style.display = "none"
})