// IIFE to initialize our app
(() => {
  
  // This setTimeout will stop my gif after 9 sec
  setTimeout(function () {
    
    // setting a fixed image inplace of gif after 9 sec
    backgroundimg.src = 'Images/animation1.png';


    // sliding animation for navigation panel
    let interval = setInterval(() => {

      // getting navbar as ele initially our navbar is out of the screen at top side
      let ele = document.getElementsByClassName("navigate")[0];
      if (parseInt(getComputedStyle(ele).top) == 0) {
        clearInterval(interval);
        
      }

      // gradually we are bringing our navbar down from top after my gif stops
      ele.style.top = parseInt(getComputedStyle(ele).top) + 0.1;

    }, 10);
  }, 9000);

})();
// some basic variable
let searchbar = document.querySelector("#searchbar");
let input = document.querySelector("#searchbar .form-control");
let button = document.getElementById("submit-button");


let backgroundimg = document.getElementsByTagName("img")[1];

// this container displayed the front side of card when we click on search button
let showContainerFront = document.getElementsByClassName("front")[0];
// this container displayed the back side of card when we click on swap icon
let showContainerBack = document.getElementsByClassName("back")[0];

// this container is displayed when we search any super hero
let listContainer = document.querySelector(".list");
// let submit = document.getElementById("submit");


// this function is to remove suggestions which comes while searching
function removeElements() {
  listContainer.innerHTML = "";
}

// event listener for input tag so that it shoes suggestions while
// searching
input.addEventListener("keyup", search);
async function search() {
  // we are calling it here so that after every keyup there are fresh lists 
  // of hero displayed 
  removeElements();

  // when we type min 4 char then only suggestion starts
  if (input.value.length < 4) {
    return false;
  }

  // url for sending req
  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&nameStartsWith=${input.value}`;

  // fetching response
  const response = await fetch(url);
  // changing response in json format
  const jsonData = await response.json();

  showSuggestions(jsonData);
}

// this funtion shows us suggestions as we type names in 
// search box
function showSuggestions(jsonData) {
  jsonData.data["results"].forEach((result) => {
    // <div class="parent autocomplete-items" onclick="displayWord(name)">
    //  <div class="img-container">
    //    <img src="">
    //  </div>
    //  <div class="text">

    //  </div>
    // </div>
    // We are trying to make the above code structure
    // ----------------------------------------------------------------
    let name = result.name;
    let parentdiv = document.createElement("div");
    parentdiv.setAttribute("onclick", "displayWords('" + name + "')");
    parentdiv.setAttribute("class", "parent");
    parentdiv.classList.add("autocomplete-items");
    parentdiv.style.cursor = "pointer";
    let div1 = document.createElement("div");
    div1.setAttribute("class", "img-container");
    let img = document.createElement("img");
    img.src = result.thumbnail["path"] + "." + result.thumbnail["extension"];
    div1.appendChild(img);
    let div2 = document.createElement("div");
    div2.setAttribute("class", "text");
    div2.innerHTML = name;
    parentdiv.appendChild(div1);
    parentdiv.appendChild(div2);
    listContainer.appendChild(parentdiv);
  });

}

// this function display our selected hero in input bar
function displayWords(value) {
  input.value = value;
  removeElements();
}


// this event will happen when we click search button
button.addEventListener("click", showCard);
async function showCard() {
  if (input.value.trim().length < 1) {
    showAlert("Input cannot be blank");
    return;
  }
  showContainerFront.innerHTML = "";

  // url for sending req
  const url = `https://gateway.marvel.com:443/v1/public/characters?hash=${hashVal}&ts=${timestamp}&name=${input.value}&apikey=${apiKey}`;

  // fetching response
  const response = await fetch(url);
  // changing response in json format
  const jsonData = await response.json();
  displayCard(jsonData);

}

// function to display card
function displayCard(jsonData) {
  // jsonData contains details of hero searched 
  // in this case we get a array in return from the server
  // thats why we are implementing for each loops
  // console.log(jsonData);
  jsonData.data["results"].forEach((element) => {
    // sometimes description of heros were not present in the server
    // so in that case we will display "Sorry no Information"
    if (element.description == "") {
      element.description = "Sorry no Information";
    }

    // Now we change the html of our container wich contain hero card
    // element.thumbnail["path"] = is the url for image
    // element.thumbnail["extension"] = is the extension
    // element.name = gives us the name of our hero
    // element.description = tell use about searched hero
    showContainerFront.innerHTML = `
        <div class="container-character-image">
        <img src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]
      }"/></div>
        <div class="character-name">${element.name}</div>
        <div class="character-description series" onClick="getSeries('${element.id}')">Series: ${element.series.available}</div>
        <div class="character-description comics" onClick="getComics('${element.id}')">Comics: ${element.comics.available}</div>
        <div class="character-description events" onClick="getEvents('${element.id}')">Events: ${element.events.available}</div>
        <div class="character-description stories" onClick="getStories('${element.id}')">Stories: ${element.stories.available}</div>

        <div id="action">
          <div class="actionbutton solid" onClick="removeFromFav('${element.name}')" data-toggle="tooltip" data-placement="top" title="remove from favourite">
            <i class="fa-solid fa-heart"></i>
          </div>
          <div class="actionbutton regular" onClick="addToFav('${element.name}')" data-toggle="tooltip" data-placement="top" title="add to favourite">
            <i class="fa-regular fa-heart"></i>
          </div>
          <div class="actionbutton swap" onClick="flipcard(${0})" data-toggle="tooltip" data-placement="top" title="swap">
            <img src="Images/swap.png">
          </div>
          <div class="actionbutton close" onClick="hideContainer()" data-toggle="tooltip" data-placement="top" title="close">
            <i class="fa-regular fa-circle-xmark" ></i>
          </div>
        </div>`;

    showContainerBack.innerHTML = `<div class="character-description-back">${element.description}</div>
        <div class="actionbutton swap" onClick="flipcard(${0})" data-toggle="tooltip" data-placement="top" title="swap">
        <img src="Images/swap.png">
        </div>`



    // while displaying card for the searched value we need to take care about
    // already added heors to favourite list if the hero was added earlier then
    // in that case we must dislplay favourite button as marked 
    //  this code will help me to do that

    

    // this condition will check whether our searched hero is already present 
    // in favourite list or not
    if (heroes != null && Object.keys(heroes).length != 0) {
      // if its present change display of solid fav button to block 
      // and regular to none
      for (let key in heroes) {
        if (key == element.name) {
          document.getElementsByClassName("regular")[0].style.display = "none";
          document.getElementsByClassName("solid")[0].style.display = "block"
        }
      }

    }
  });
  // this will show our Hero card on screen
  showContainer.style.display = "block";
}


// this function is gets called when we click on close button
function hideContainer() {
  showContainer.style.display = "none";
}
// // when we click on search input automatically background image will gets blurred
searchbar.addEventListener('mouseover', () => {
  blurr(backgroundimg);
});

searchbar.addEventListener('mouseout', () => {
  blurr(backgroundimg);
});

// when we click on hero card input automatically background image will gets blurred
showContainer.addEventListener('mouseover', () => {
  blurr(backgroundimg);
});
showContainer.addEventListener('mouseout', () => {
  blurr(backgroundimg);
});



// function to make elements blurr
function blurr(tag) {
  if (tag.className == "") {
    tag.setAttribute("class", "blur");
  }
  else {
    tag.setAttribute("class", "");
  }

}

// this function is called when we click on remove fav button
function removeFromFav(name) {
  document.getElementsByClassName("regular")[0].style.display = "block";
          document.getElementsByClassName("solid")[0].style.display = "none"
  // let charArr = localStorage.getItem("list");
  // charArr = JSON.parse(charArr);
  delete heroes[name];
  localStorage.setItem("list", JSON.stringify(heroes))
  showAlert("removed from favourite")
}

// this function is called when we click on add fav button
function addToFav(name) {
  document.getElementsByClassName("regular")[0].style.display = "none";
  document.getElementsByClassName("solid")[0].style.display = "block"
  // let charArr = localStorage.getItem("list");
  if (heroes == null) {
    heroes = {};
    heroes[name] = name;
    console.log(heroes);
    localStorage.setItem("list", JSON.stringify(heroes));
    return;
  }
  // heroes = JSON.parse(heroes);
  heroes[name] = name;
  localStorage.setItem("list", JSON.stringify(heroes));
  showAlert("added to favourite")


}

// localStorage.clear("list")
