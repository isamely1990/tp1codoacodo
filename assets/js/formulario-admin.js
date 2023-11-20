generoMock = [
  "MMORPG",
  "Social",
  "Shooter",
  "Strategy",
  "Fighting",
  "Card Game",
  "MOBA",
  "MMO",
  "Battle Royale",
  "Card",
  "MMOARPG",
  "Sports",
  "Racing",
  "Action RPG",
  "ARPG",
  "Fantasy",
];

editorMock = [
  "Zemi Interactive",
  "Snail Games",
  "Archive Entertainment ",
  "Battlezone",
  "NEOWIZ",
  "Jarbit",
  "Suba Games",
  "NCSOFT",
  "My.com (Mail.ru Group)"
];

desarrolladorMock = [
  "Zemi Interactive",
  "Snail Games",
  "Archive Entertainment ",
  "JoongWon Games",
  "NEOWIZ",
  "Jarbit",
  "MasangSoft",
  "NCSOFT",
  "Obsidian Entertainment"
];

document.addEventListener("DOMContentLoaded", () => {
  const genero = {
    id: "genero",
    lista: generoMock,
  };
  const desarrollador = {
    id: "desarrollador",
    lista: desarrolladorMock,
  };
  const editor = {
    id: "editor",
    lista: editorMock,
  };

  [genero, desarrollador, editor].forEach((selector) => {
    let selectorElement = document.getElementById(selector.id);
    defineListaSelectorSimple(selector.lista, selectorElement);
  });

  /**
   * Generamos un selector simple
   * @param {string[]} list
   * @param {Element} divElement
   */
  function defineListaSelectorSimple(list, divElement) {
    list.sort();
    let opcionSelector = `<option value="">Seleccione una opción...</option>`;
    // Iteramos el listado y creamos el elemento html por cada item
    list.forEach((item) => {
      opcionSelector += `<option value="${item}">${item}</option>`;

      divElement.innerHTML = opcionSelector;
    });
  }
});
