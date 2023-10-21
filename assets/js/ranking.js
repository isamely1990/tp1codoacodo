document.addEventListener("DOMContentLoaded", function () {
  fetch("assets/js/person_data.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // Iteramos 4 veces que es la cantidad de 'ul' que precisamos
      for (let i = 1; i < 5; i++) {
        let randomItems = getRandomItemsFromMock(jsonData, 5);
        let itemList = document.getElementById("ranking-list-" + i);
        generateList(randomItems, itemList);
      }
    })
    .catch((error) => console.error("Error fetching JSON data: ", error));

  /**
   * Generamos cada tag 'li' para la vista a partir de un listado random
   * @param {*} list
   * @param {*} idElement
   */
  function generateList(list, divElement) {
    let rankingItem = "";
    // Iteramos el listado y creamos el elemento html por cada item
    list.forEach((item) => {
      rankingItem += ` <li class="ranking-item">
                <img class="ranking-item-image" src="${item.avatar}" alt="${item.name}">
                <div class="ranking-item-content">
                <div class="ranking-text">
                <p>${item.first_name} ${item.last_name}</p>
                <p>${item.score}</p>
                <p>${item.location}</p>
                </div>
                </div>
                </li>
                `;

      divElement.innerHTML = rankingItem;
    });
  }

  /**
   * Selecciona 5 items del mock al azar
   * @param {*} jsonMock 
   * @param {*} count 
   * @returns 
   */
  function getRandomItemsFromMock(jsonMock, count) {
    const shuffledArray = jsonMock.slice();
    const randomItems = [];

    // Iteramos para tomar 5 item al azar
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * shuffledArray.length);
      const selectedItem = shuffledArray.splice(randomIndex, 1)[0];
      randomItems.push(selectedItem);
    }

    return randomItems;
  }
});
