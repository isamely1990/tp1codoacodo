//TODO: Conectar a la base y con una query obtener todos los valores de la columna, acumular para obtener un listado de opciones
document.addEventListener("DOMContentLoaded", () => {
  generoMock = [];

  editorMock = [];

  desarrolladorMock = [];

  const url = "//127.0.0.1:5000/";

  if (window.location.pathname === "/formulario.html") {
    traerDatosDevPublisherGenre(url);
  }

  function traerDatosDevPublisherGenre(url) {
    // Obtener datos desde la api (url)
    fetch(url + "formulario")
      .then((response) => response.json())
      .then((datosApi) => {
        generaListasOpcionesFormulario(datosApi);
      })
      .catch((error) => console.log(error));
  }

  /**
   * Parsea lista de opciones para mostrar valores unicos en los selectores
   * @param {*} datosObtenidos 
   */
  function generaListasOpcionesFormulario(datosObtenidos) {
    let gen = [];
    let dev = [];
    let pub = [];

    datosObtenidos.forEach((row) => {
      gen.push(row.genre);
      dev.push(row.developer);
      pub.push(row.publisher);
    });

    // Seteamos los listados con los valores únicos, omite repetidos.
    generoMock = [...new Set(gen)];
    desarrolladorMock = [...new Set(dev)];
    editorMock = [...new Set(pub)];

    const genero = {
      id: "genre",
      lista: generoMock,
    };

    const desarrollador = {
      id: "developer",
      lista: desarrolladorMock,
    };

    const editor = {
      id: "publisher",
      lista: editorMock,
    };

    // Por cada mock, obtiene un elemento html donde se inserta y llama al método que generará las opciones en el selector
    [genero, desarrollador, editor].forEach((selector) => {
      let selectorElement = document.getElementById(selector.id);
      defineListaSelectorSimple(selector.lista, selectorElement);
    });
  }

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
