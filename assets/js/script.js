// Seleccionar el botón de calcular por su id y agregar un event listener
const botonCalcular = document.querySelector("#calcular");
botonCalcular.addEventListener("click", tomarParametros);

let cuotaMensual = 0;
let totalAPagar = 0;

// Cargar los elementos almacenados en el Local Storage al cargar la página
cargarItemsLocalStorage();

// Función que se ejecuta cuando se hace clic en el botón "Calcular"
function tomarParametros() {
    // Obtener los valores ingresados por el usuario desde los campos de entrada
    const nombreProducto = document.querySelector("#input-nombre").value;
    const precioProducto = parseFloat(document.querySelector("#input-precio").value); // Convertir a número
    const cuotasProducto = parseInt(document.querySelector("#input-cuotas").value); // Convertir a número
    const interesProducto = parseFloat(document.querySelector("#input-interes").value); // Convertir a número
    const interesDecimal = interesProducto / 100;
    totalAPagar = precioProducto + (precioProducto * interesDecimal);
    cuotaMensual = totalAPagar / cuotasProducto;

    if (!nombreProducto || isNaN(precioProducto) || isNaN(cuotasProducto) || isNaN(interesProducto)) {
        alert("Todos los campos son obligatorios y deben contener valores numéricos válidos");
        return; // Detener la ejecución si falta algún campo
    }

    // Llamar a la función para mostrar un elemento en el historial con los parámetros ingresados
    mostrarItemHistorial(new Item(nombreProducto, precioProducto, cuotasProducto, interesProducto));

    // Limpiar los campos de entrada después de calcular
    document.querySelector("#input-nombre").value = "";
    document.querySelector("#input-precio").value = "";
    document.querySelector("#input-cuotas").value = "";
    document.querySelector("#input-interes").value = "";
}

// Función para guardar un objeto en el Local Storage
function guardarItemStorage(item) {
    localStorage.setItem(item.nombre, JSON.stringify(item));
}

// Función para cargar los elementos almacenados en el Local Storage al cargar la página
function cargarItemsLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        // Llamar a la función para mostrar un elemento en el historial a partir de los datos en el Local Storage
        mostrarItemHistorial(JSON.parse(value));
    }
}

// Función para mostrar un elemento en el historial y guardar en el Local Storage
function mostrarItemHistorial(item) {
    // Llamar a la función para guardar el elemento en el Local Storage
    guardarItemStorage(item);

    // Obtener el elemento del DOM que contiene el historial
    const accordion = document.querySelector("#accordionExample");
    const elementoItem = document.createElement("div");
    elementoItem.className = "item-historial";
    accordion.appendChild(elementoItem);

    // Obtener la cantidad de elementos en el historial
    let cantidadItems = document.querySelectorAll(".item-historial").length;

    // Crear el HTML para mostrar el elemento en el historial
    elementoItem.innerHTML = `
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${`collapse${cantidadItems}`}" aria-expanded="true" aria-controls="${`collapse${cantidadItems}`}">
                ${item.nombre}
            </button>
        </h2>
        <div id="${`collapse${cantidadItems}`}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div class="accordion-body">
                <p><strong>Precio:</strong> $${item.precio}</p>
                <p><strong>Cuotas:</strong> ${item.cuotas}</p>
                <p><strong>Interés:</strong> ${item.interes}%</p>
                <p><strong>Valor de la Cuota Mensual:</strong> $${cuotaMensual.toFixed(2)}</p>
                <p><strong>Total a Pagar:</strong> $${totalAPagar.toFixed(2)}</p>
                <button type="button" class="btn btn-danger eliminar-item" style="margin: auto; display: block;">Eliminar</button>
            </div>    
        </div>
    </div>`;

    const botonEliminar = elementoItem.querySelector(".eliminar-item");
    botonEliminar.addEventListener("click", function () {
        // Eliminar el elemento del DOM
        elementoItem.remove();

        // Eliminar el elemento del Local Storage (usando el nombre como clave)
        localStorage.removeItem(item.nombre);
    });
}

function filtrarHistorial() {
    // Obtener el valor del filtro ingresado por el usuario
    const filtroNombre = document.querySelector("#filtro-nombre").value.toLowerCase();

    // Obtener todos los elementos del historial
    const elementosHistorial = document.querySelectorAll(".item-historial");

    // Aplicar el filtro utilizando forEach
    elementosHistorial.forEach((elemento) => {
        // Obtener el nombre del producto dentro del elemento
        const nombreProducto = elemento.querySelector("button").textContent.toLowerCase();

        // Comparar el nombre del producto con el valor del filtro
        if (nombreProducto.includes(filtroNombre)) {
            // Mostrar el elemento si cumple con el filtro
            elemento.style.display = "block";
        } else {
            // Ocultar el elemento si no cumple con el filtro
            elemento.style.display = "none";
        }
    });
}

// Agregar un evento keyup al campo de filtro para activar el filtrado en tiempo real
const filtroInput = document.querySelector("#filtro-nombre");
filtroInput.addEventListener("keyup", filtrarHistorial);

// Clase para representar un elemento del historial
class Item {
    constructor(nombre, precio, cuotas, interes) {
        this.nombre = nombre;
        this.precio = precio;
        this.cuotas = cuotas;
        this.interes = interes;
    }
}
