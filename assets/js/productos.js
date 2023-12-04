// let urlApi = "https://www.freetogame.com/api/games"
let datosObtenidos = {};
let datosObtenidos1 = {};
let tarjetasContenedor = document.querySelector("#contenedor_tarjetas");
let chekboxesContenedor = document.querySelector("#contenedor-checkboxes");
let listaContenedor = document.querySelector("#contenedor-lista");

let detalleContenedor = document.querySelector("#contenedor_detalle");
let novedadesContenedor = document.querySelector("#seccion-novedades");
let algunosJuegosContenedor = document.querySelector(
  "#contenedor_algunos_juegos"
);

let detalleImagenesAdicionales = document.querySelector(
  "#contenedor_detalle_imagenes_adicionales"
);

/* const url = 'https://free-to-play-games-database.p.rapidapi.com/api/games?sort-by=alphabetical';
const urldet = 'https://free-to-play-games-database.p.rapidapi.com/api/game?id=';
 */
const url = "//127.0.0.1:5000/";
const urldet = "//127.0.0.1:5000/";
const urlWeb = "http://127.0.0.1:5500/";

/* const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '017c8eb89bmsh86d069438677a3ep13ae98jsn43c886387eca',
    'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
  }
};
 */

if (document.title == "productos") {
  traerDatos(url);
} else if (document.title == "detalle") {
  traerDatosDetalle(urldet);
} else if (document.title == "index") {
  traerDatosIndex(url);
} else if (document.title == "CRUD") {
  traerDatosCrud(url);
}

// formulario admin
const urlParams = new URLSearchParams(window.location.search);
let idJuego = urlParams.get("edit_id");

if (idJuego) {
  traerDatosDetalle(urldet, idJuego);
}

// termina formulario admin

function traerDatosIndex(url) {
  // Obtener datos desde la api (url)
  // Procesar segun que pagina este activada
  fetch(url + "crud")
    .then((response) => response.json())
    .then((datosApi) => {
      datosObtenidos = datosApi;

      // Llamar a la función para obtener 6 números al azar
      let numerosAlAzar1 = seleccionarNumerosAlAzar(12);
      /*      console.log("Números seleccionados al azar: " + numerosAleatorios);
           console.log(datosObtenidos[numerosAleatorios[0]])
           console.log(datosObtenidos[numerosAleatorios[1]])
           console.log(datosObtenidos[numerosAleatorios[2]])
           console.log(datosObtenidos[numerosAleatorios[3]])
           console.log(datosObtenidos[numerosAleatorios[4]])
           console.log(datosObtenidos[numerosAleatorios[5]])
       */
      crearMostrarImagenesNovedad(
        datosObtenidos,
        numerosAlAzar1,
        novedadesContenedor
      );

      let numerosAlAzar2 = seleccionarNumerosAlAzar(7);

      crearMostrarAlgunosJuegos(
        datosObtenidos,
        numerosAlAzar2,
        algunosJuegosContenedor
      );
    })
    .catch((error) => console.log(error));
}

function crearMostrarImagenesNovedad(arregloJuegos, numeros, ubicacion) {
  console.log(numeros);
  console.log(ubicacion);

  let imagenes = "";

  for (let i = 0; i < numeros.length; i++) {
    imagenes += `<div class="imagen-novedad">
  <img src="${
    arregloJuegos[numeros[i]].thumbnail
  }" class="imagen-redondeada" alt="Juego 1">
</div>`;
  }

  ubicacion.innerHTML = imagenes;
}

function crearMostrarAlgunosJuegos(arregloJuegos, numeros, ubicacion) {
  let imagenes = "";

  for (let i = 0; i < numeros.length; i++) {
    imagenes += `<div class="juego">
  <img src="${arregloJuegos[numeros[i]].thumbnail}" alt="Juego 1">
<p class="descripcion">${arregloJuegos[numeros[i]].title}</p>
<p class="genero">Genero : ${arregloJuegos[numeros[i]].genre}</p>
<p class="precio">$19.99</p>

<a href="../../detalle.html?id=${
      arregloJuegos[numeros[i]].id
    }" class="boton">Más Detalles</a>

</div>`;
  }

  console.log(imagenes);
  ubicacion.innerHTML = imagenes;
}

function traerDatos(url) {
  // Obtener datos desde la api (url)
  // Procesar segun que pagina este activada
  fetch(url + "crud")
    .then((response) => response.json())
    .then((datosApi) => {
      datosObtenidos = datosApi;
      console.log(datosObtenidos);

      crearMostrarCheckboxes(datosObtenidos, chekboxesContenedor);

      crearMostrarTarjetas(datosObtenidos, tarjetasContenedor);
    })
    .catch((error) => console.log(error));
}

function crearMostrarTarjetas(arregloJuegos, ubicacion) {
  let tarjetas = "";

  arregloJuegos.forEach((juego) => {
    tarjetas += `<div class="juego">
       <img src="${juego.thumbnail}" alt="Juego 1">
    <p class="descripcion">${juego.title}</p>
    <p class="genero">Genero : ${juego.genre}</p>
    <p class="precio">$19.99</p>
    <a href="../../detalle.html?id=${juego.id}" class="boton">Más Detalles</a> 
    
    </div>`;
  }); //aca termina el forEach

  ubicacion.innerHTML = tarjetas;
}

function traerDatosDetalle(urldet, editarJuegoId) {
  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");

  // fetch(urldet + 'crud/' + id)
  // si recibe el argumento editarJuegoId lo usa, y sería para mostrar en el formulario de edición
  // de lo contrario, usa el id simple si lo obiene, es decir la vista "detalle"
  fetch(url + "crud/" + (editarJuegoId || id))
    .then((response) => response.json())
    .then((datosApi) => {
      datosDetalle = datosApi;

      console.log(datosDetalle);

      // Genera la vista de "detalle"
      if (id) {
        crearMostrarDetalleJuego(datosDetalle, detalleContenedor);
        crearMostrarImagenesAdicionales(
          datosDetalle,
          detalleImagenesAdicionales
        );
      }

      // Genera la vista de formulario de edición, tiene un timeout para dar tiempo a que se formen los selectores
      if (editarJuegoId) {
        setTimeout(() => {
          completarFormularioEdicion(datosDetalle);
        }, 500);
      }
    })
    .catch((error) => console.log(error));
}

function crearMostrarDetalleJuego(detalleJuego, ubicacion) {
  let detalle = "";

  let minimumSystemRequirements = detalleJuego.minimum_system_requirements;

  /*   detalle = ` <div class="contenedor_imagen_detalle">
    <img src="${detalleJuego.thumbnail}" class="imagen_detalle" alt="">
</div>

<div class="descripcion">
<p>${detalleJuego.description}</p>
</div>

<div class="system-requirements-container">
<h2 class="titulo-negro">Minimum System Requirements:</h2>
<ul class="system-requirements-list">
    <li><strong>OS:</strong>${minimumSystemRequirements.os}</li>
    <li><strong>Processor:</strong>${minimumSystemRequirements.processor}</li>
    <li><strong>Memory:</strong>${minimumSystemRequirements.memory}</li>
    <li><strong>Graphics:</strong>${minimumSystemRequirements.graphics}</li>
    <li><strong>Storage:</strong>${minimumSystemRequirements.storage}</li>
</ul>
</div> 
`
 */

  detalle = ` <div class="contenedor_imagen_detalle">
<img src="${detalleJuego.thumbnail}" class="imagen_detalle" alt="">
</div>

<div class="titulo">
<p>${detalleJuego.title}</p>
</div>

<div class="descripcion">
<p>${detalleJuego.short_description}</p>
</div>

<div class="system-requirements-container">
<h2 class="titulo-negro">Detalles</h2>
</div> 

<table id="tablaDetalles">
    
    <tr>
      <th>Título</th>
      <th>Detalle</th>
    </tr>
    
    <tr>
      <td>Género</td>
      <td <p>${detalleJuego.genre}</p> </td>
    </tr>
    
    <tr>
      <td>Plataforma</td>
      <td <p>${detalleJuego.platform}</p> </td>
    </tr>
    
    <tr>
      <td>Desarrollador</td>
      <td <p>${detalleJuego.developer}</p> </td>
    </tr>
    <tr>
      <td>Fecha de Presentación</td>
      <td <p>${detalleJuego.release_date}</p> </td>
    </tr>
  </table> 
  `;

  ubicacion.innerHTML = detalle;
}

function crearMostrarImagenesAdicionales(detalleJuego, ubicacion) {
  console.log(detalleJuego);

  let detalle = "";

  /*   detalleJuego.screenshots.forEach(imagen => {
    detalle += `<div class="imagen_adicional">
       <img src="${imagen.image}" alt="Juego 1">
        </div>`

  }) //aca termina el forEach
 */
  ubicacion.innerHTML = detalle;
}

// MANEJO DATOS PARA CRUD.HTML
function traerDatosCrud(url) {
  // Obtener datos desde la api (url)
  // Procesar segun que pagina este activada
  fetch(url + "crud")
    .then((response) => response.json())
    .then((datosApi) => {
      datosObtenidos = datosApi;
      console.log(datosObtenidos);
      crearMostrarLista(datosObtenidos, listaContenedor);
    })
    .catch((error) => console.log(error));
}

function crearMostrarLista(juegos, ubicacion) {
  // Iterar a través del JSON de datos
  juegos.forEach((juego) => {
    // Crear una nueva fila <tr>
    const nuevaFila = document.createElement("tr");

    // Agregar los datos a las celdas de la fila
    nuevaFila.innerHTML = `
      <td>${juego.id}</td>
      <td>${juego.title}</td>
      <td>${juego.genre}</td>
      <td style="width: 250px;">${juego.developer}</td>
      <td style="width: 250px;">${juego.publisher}</td>
      <td>

      <div>
        <a href="/formulario.html?edit_id=${juego.id}"">
          <button type="button" class="btn btn-primary">
            Editar
          </button>
        </a>
        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal-${juego.id}">
          Eliminar
        </button>
      </div>

        <!-- Modal -->
        <div class="modal fade" id="exampleModal-${juego.id}" tabindex="-1" aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Eliminar</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" data-bs-toggle="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Esta seguro que desea eliminar esta informacion?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-bs-toggle="modal">Atras</button>
                <button type="button" data-bs-toggle="modal" id="btnEliminarJuego-${juego.id}" class="btn btn-danger">Si, eliminar</button>
              </div>
            </div>
          </div>
        </div>

        </td>
    `;  
  
    // Agregar la nueva fila al cuerpo de la tabla
    ubicacion.appendChild(nuevaFila);

    // Agrega el evento de clic al botón "Eliminar" específico para este juego
    var btnEliminarJuego = document.getElementById(`btnEliminarJuego-${juego.id}`);
    if (btnEliminarJuego) {
      btnEliminarJuego.addEventListener('click', function() {
        // Invoca método eliminar
        eliminarJuego(juego.id);
      });
    }
  });
}

function seleccionarNumerosAlAzar(cantidadNumeros) {
  const numerosDisponibles = [];
  for (let i = 1; i <= 388; i++) {
    numerosDisponibles.push(i);
  }

  const numerosSeleccionados = [];

  while (numerosSeleccionados.length < cantidadNumeros) {
    const indiceAleatorio = Math.floor(
      Math.random() * numerosDisponibles.length
    );
    const numeroSeleccionado = numerosDisponibles.splice(indiceAleatorio, 1)[0];
    numerosSeleccionados.push(numeroSeleccionado);
  }

  return numerosSeleccionados;
}

// Formulario de edición

/**
 * Completa los campos del form con los valores del juego
 */
function completarFormularioEdicion(datosJuego) {
  // Convertir la cadena de fecha a un objeto Date de JavaScript
  const fechaObjeto = new Date(datosJuego.release_date);
  // Formatear la fecha en el formato 'YYYY-MM-DD'
  const fechaFormateada = fechaObjeto.toISOString().split("T")[0];

  //Defino la plataforma del juego con boleanos
  esWindowsPc = datosJuego.platform === "PC (Windows)";
  esWebBrowser = datosJuego.platform === "Web Browser";

  document.getElementById("title").value = datosJuego.title;
  document.getElementById("short_description").value =
    datosJuego.short_description;
  document.getElementById("thumbnail").value = datosJuego.thumbnail;
  document.getElementById("game_url").value = datosJuego.game_url;
  document.getElementById("release_date").value = fechaFormateada;
  document.getElementById("windows").checked = esWindowsPc;
  document.getElementById("web").checked = esWebBrowser;

  const selectorGenero = document.getElementById("genre");
  const selectorDeveloper = document.getElementById("developer");
  const selectorPublisher = document.getElementById("publisher");

  gen = {
    select: selectorGenero,
    valor: datosJuego.genre,
  };
  dev = {
    select: selectorDeveloper,
    valor: datosJuego.developer,
  };
  pub = {
    select: selectorPublisher,
    valor: datosJuego.publisher,
  };

  [gen, dev, pub].forEach((selector) => {
    seteaValorSelector(selector.select, selector.valor);
  });
}

/**
 * Setea la opción seleccionada en un selector
 * @param {*} selector
 * @param {*} valor
 */
function seteaValorSelector(selector, valor) {
  // Iterar sobre las opciones y establecer el atributo selected si coincide con el valor deseado
  for (let i = 0; i < selector.options.length; i++) {
    if (selector.options[i].value === valor) {
      selector.options[i].selected = true;
      break; // Romper el bucle una vez que se haya establecido el valor
    }
  }
}

/**
 * Generamos un objeto con los datos del formulario para usarlo como payload en el body
 */
function guardarFormulario() {
  console.log("Guardando datos del form...");

  // Obtenemos los valores de los campos de formulario
  let title = document.getElementById("title").value;
  let short_description = document.getElementById("short_description").value;
  let thumbnail = document.getElementById("thumbnail").value;
  let game_url = document.getElementById("game_url").value;
  let release_date = document.getElementById("release_date").value;
  let platform = document.getElementById("windows").checked
    ? "PC (Windows)"
    : "Web Browser";
  let genre = document.getElementById("genre").value;
  let developer = document.getElementById("developer").value;
  let publisher = document.getElementById("publisher").value;

  // Construye el objeto con los datos a enviar
  var data = {
    title,
    short_description,
    thumbnail,
    game_url,
    release_date,
    platform,
    genre,
    publisher,
    developer,
  };
  var jsonData = JSON.stringify(data);

  if (idJuego) {
    console.log("Editando...");
    editarJuegoPorID(jsonData);
  } else {
    console.log("Creando...");
    crearJuegoNuevo(jsonData);
  }
}

function editarJuegoPorID(formData) {
  fetch(`${url}crud/${idJuego}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((datosApi) => {
      datosDetalle = datosApi;
      window.location.href = `${urlWeb}crud.html`;
    })
    .catch((error) => console.log(error));
}

function crearJuegoNuevo(formData) {
  fetch(`${url}crud`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: formData,
  })
    .then((response) => {
      response.json();
      window.location.href = `${urlWeb}crud.html`;
    })
    .catch((error) => console.log(error));
}

function eliminarJuego(id) {
  console.log("Eliminando...", id);
  fetch(`${url}crud/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      location.reload();
    })
    .catch((error) => console.log(error));
}

// poner filtros
// volver a crearMostrarTarjetas con arreglo filtrado

const inputTexto = document.querySelector("#texto");
if (inputTexto) {
  inputTexto.addEventListener("input", () => {
    filtroCruzado();
  });
}

const divChecks = document.getElementById("contenedor-checkboxes");
if (divChecks) {
  divChecks.addEventListener("change", filtroCruzado);
}

function filtroCruzado() {
  let filtradoPorTexto = filtrarPorTexto(datosObtenidos, inputTexto.value);
  let filtradoPorTextoYCheckboxes = filtrarPorCategoria(filtradoPorTexto);

  if (filtradoPorTextoYCheckboxes.length === 0) {
    // Si no hay resultados, muestra el mensaje de notificación.
    document.getElementById("mensajeNoResultados").style.display = "block";
  } else {
    document.getElementById("mensajeNoResultados").style.display = "none";
  }

  crearMostrarTarjetas(filtradoPorTextoYCheckboxes, tarjetasContenedor);
}

function filtrarPorTexto(arregloDeElementos, texto) {
  let elementosFiltrados = arregloDeElementos.filter((elemento) =>
    elemento.title.toLowerCase().includes(texto.toLowerCase())
  );
  return elementosFiltrados;
}

function filtrarPorCategoria(arregloDeElementos) {
  let checkboxes = document.querySelectorAll("input[type='checkbox']");
  let arrayCheckboxes = Array.from(checkboxes);
  let checksPrendidos = arrayCheckboxes.filter((check) => check.checked);
  let valoresChecks = checksPrendidos.map((check) => check.value);

  if (valoresChecks.length == 0) {
    return arregloDeElementos;
  }

  let elementosFiltrados = arregloDeElementos.filter((elemento) =>
    valoresChecks.some((categoria) =>
      elemento.genre.toLowerCase().includes(categoria.toLowerCase())
    )
  );

  return elementosFiltrados;
}

function crearMostrarCheckboxes(arregloEventos, ubicacion) {
  let categoriasUnicas = [];

  let soloCategorias = arregloEventos.map((evento) => evento.genre.trim());

  soloCategorias.forEach((categoria) => {
    if (!categoriasUnicas.includes(categoria)) {
      categoriasUnicas.push(categoria);
    }

    let checkboxes = "";
    for (categoria of categoriasUnicas) {
      checkboxes += `
    <div class="checkbox-container" >
    <input value="${categoria}" class="custom-checkbox" type="checkbox" id="${categoria}">
        <label class="checkbox-label" for="${categoria}">${categoria}</label>
     </div>`;
    }
    ubicacion.innerHTML = checkboxes;
  });
}
