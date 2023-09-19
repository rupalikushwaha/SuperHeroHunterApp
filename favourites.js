// this iife will display all our fav cards when our apps relode
(async () => {

  if (heroes != null && Object.keys(heroes).length != 0) {
    let i=0;
    for (let names in heroes) {
      // url for sending req
      const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&name=${names}`;

      // fetching response
      const response = await fetch(url);
      // changing response in json format
      const jsonData = await response.json();
      displayCard(jsonData,i);
      i++;
    }
  } else {

    showContainer.innerHTML = "Empty";
  }
})();

// function to display card
function displayCard(jsonData,i) {

  // jsonData contains details of hero searched 
  // in this case we get a array in return from the server
  // thats why we are implementing for each loop
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
    let card = document.createElement("div");
    card.setAttribute("class","card-container");
    card.innerHTML = `<div class="front">
                        <div class="container-character-image">
                          <img src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}"/>
                        </div>
                        <div class="character-name">${element.name}</div>
                        <div class="character-description series" onClick="getSeries('${element.id}')">Series: ${element.series.available}</div>
                        <div class="character-description comics" onClick="getComics('${element.id}')">Comics: ${element.comics.available}</div>
                        <div class="character-description events" onClick="getEvents('${element.id}')">Events: ${element.events.available}</div>
                        <div class="character-description stories" onClick="getStories('${element.id}')">Stories: ${element.stories.available}</div>

                        <div class="action">
                          <div class="actionbutton solid" onClick="removeFromFav('${element.name}',${i})" data-toggle="tooltip"
                            data-placement="top" title="remove from favourite">
                            <i class="fa-solid fa-heart"></i>
                          </div>
                          <div class="actionbutton regular" onClick="addToFav('${element.name}',${i})" data-toggle="tooltip"
                            data-placement="top" title="add to favourite">
                            <i class="fa-regular fa-heart"></i>
                          </div>
                          <div class="actionbutton swap" onClick="flipcard(${i})" data-toggle="tooltip" data-placement="top" title="swap">
                            <img src="Images/swap.png">
                          </div>
                        </div>
                      </div>
                      <div class="back"><div class="character-description-back">${element.description}</div>
                      <div class="action">
                      <div class="actionbutton solid" onClick="removeFromFav('${element.name}',${i})" data-toggle="tooltip"
                        data-placement="top" title="remove from favourite">
                        <i class="fa-solid fa-heart"></i>
                      </div>
                      <div class="actionbutton regular" onClick="addToFav('${element.name}',${i})" data-toggle="tooltip"
                        data-placement="top" title="add to favourite">
                        <i class="fa-regular fa-heart"></i>
                      </div>
                      <div class="actionbutton swap" onClick="flipcard(${i})" data-toggle="tooltip" data-placement="top" title="swap">
                        <img src="Images/swap.png">
                      </div>
                    </div>
                      </div>`;
    // console.log(card);
    showContainer.appendChild(card);
    // console.log(container)



    // while displaying card for the searched value we need to take care about
    // already added heors to favourite list if the hero was added earlier then
    // in that case we must dislplay favourite button as marked 
    //  this code will help me to do that



    // this condition will check whether our searched hero is already present 
    // in favourite list or not
    if (heroes != null && Object.keys(heroes).length != 0) {
      // if its present change display of solid fav button to block 
      // and regular to none
      let j =0;
      for (let key in heroes) {
        if (key == element.name) {
          document.getElementsByClassName("regular")[j].style.display = "none";
          document.getElementsByClassName("regular")[j+1].style.display = "none";
          document.getElementsByClassName("solid")[j].style.display = "block"
          document.getElementsByClassName("solid")[j+1].style.display = "block"
        }
        j=j+2;
      }

    }
  });
  // // this will show our Hero card on screen
  // container.style.display = "block";
}


// this function is called when we click on remove fav button
function removeFromFav(name,i) {
  document.getElementsByClassName("regular")[2*i].style.display = "block";
  document.getElementsByClassName("regular")[2*i+1].style.display = "block";
  document.getElementsByClassName("solid")[2*i].style.display = "none";
  document.getElementsByClassName("solid")[2*i+1].style.display = "none";
  // let charArr = localStorage.getItem("list");
  // charArr = JSON.parse(charArr);
  delete heroes[name];
  localStorage.setItem("list", JSON.stringify(heroes))
  showAlert("removed from favourite")
  window.location.reload();
}

// this function is called when we click on add fav button
function addToFav(name,i) {
  // console.log(i)
  document.getElementsByClassName("regular")[2*i].style.display = "none";
  document.getElementsByClassName("regular")[2*i+1].style.display = "none";
  document.getElementsByClassName("solid")[2*i].style.display = "block";
  document.getElementsByClassName("solid")[2*i+1].style.display = "block";
  // let charArr = localStorage.getItem("list");
  if (heroes == null) {
    heroes = {};
    heroes[name] = name;
    console.log(charArr)
    localStorage.setItem("list", JSON.stringify(heroes));
    return;
  }
  heroes[name] = name;
  localStorage.setItem("list", JSON.stringify(heroes));
  showAlert("added to favourite")
  window.location.reload();
}

