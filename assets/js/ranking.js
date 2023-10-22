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
      rankingItem += ` <tr>
          <td><img src="${item.avatar}" alt="${item.first_name}"></td>
          <td>${item.first_name} ${item.last_name}</td>
          <td>${item.location}</td>
          <td>${item.score}</td>
          </tr>
        `;

      divElement.innerHTML = rankingItem;
    });
  }

  /**
   * Selecciona 5 items del mock al azar y los ordena por score de mayor a menor
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

    return randomItems.sort(compareDescNumber);
  }

  // Función de comparación personalizada para ordenar de mayor a menor
  function compareDescNumber(a, b) {
    return b.score - a.score;
  }
});
