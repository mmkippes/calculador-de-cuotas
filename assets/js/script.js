// Declaraciones de variables y constantes globales
let cuotaMensual = 0;
let totalAPagar = 0;
let monedaActual = "ARS"; // Moneda actual seleccionada (predeterminada a pesos argentinos)

// Función para cambiar la moneda
function cambiarMoneda() {
    document.querySelectorAll(".item-historial").forEach((item) => item.remove()); // Eliminar elementos del historial existentes
    const monedaSeleccionada = document.querySelector("#monedas").value;
    if (monedaSeleccionada === "USD") {
        monedaActual = "USD"; // Cambiar la moneda a dólares estadounidenses
        cargarItemsLocalStorage();
    } else {
        monedaActual = "ARS"; // Cambiar la moneda a pesos argentinos
        cargarItemsLocalStorage();
    }
}

// Función asincrónica para obtener el valor de venta del dólar blue
async function obtenerValorDolar() {
    return new Promise((resolve, reject) => {
        fetch("https://dolarapi.com/v1/dolares/blue")
            .then((response) => response.json())
            .then((data) => {
                resolve(data.venta); // Valor de venta del dólar blue
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Clase para representar un elemento del historial
class Item {
    constructor(nombre, precio, cuotas, interes, precioEnDolares) {
        this.nombre = nombre;
        this.precio = precio;
        this.cuotas = cuotas;
        this.interes = interes;
        this.precioEnDolares = this.precio / precioEnDolares;
    }
}

// Función para mostrar un elemento en el historial y guardar en el Local Storage
function mostrarItemHistorial(item, monedaActual) {
    guardarItemStorage(item);

    let precioProducto = monedaActual === "ARS" ? item.precio : item.precioEnDolares;

    const interesDecimal = item.interes / 100;
    const totalAPagar = precioProducto + (precioProducto * interesDecimal);
    const cuotaMensual = totalAPagar / item.cuotas;

    const accordion = document.querySelector("#accordionExample");
    const elementoItem = document.createElement("div");
    elementoItem.className = "item-historial";
    accordion.appendChild(elementoItem);

    let cantidadItems = document.querySelectorAll(".item-historial").length;

    elementoItem.innerHTML = `
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${cantidadItems}" aria-expanded="true" aria-controls="collapse-${cantidadItems}">
                ${item.nombre}
            </button>
        </h2>
        <div id="collapse-${cantidadItems}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div class="accordion-body">
                <p><strong>Precio:</strong> $<span class="moneda">${precioProducto.toFixed(2)}</span></p>
                <p><strong>Cuotas:</strong> ${item.cuotas}</p>
                <p><strong>Interés:</strong> ${item.interes}%</p>
                <p><strong>Valor de la Cuota Mensual:</strong> $<span class="moneda">${cuotaMensual.toFixed(2)}</span></p>
                <p><strong>Total a Pagar:</strong> $<span class="moneda">${totalAPagar.toFixed(2)}</span></p>
                <button type="button" class="btn btn-danger eliminar-item" style="margin: auto; display: block;">Eliminar</button>
            </div>
        </div>
    </div>`;

    const botonEliminar = elementoItem.querySelector(".eliminar-item");
    botonEliminar.addEventListener("click", function () {
        elementoItem.remove();
        localStorage.removeItem(item.nombre); // Eliminar el elemento del Local Storage
    });
}

// Función para cargar los elementos almacenados en el Local Storage al cargar la página
function cargarItemsLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        mostrarItemHistorial(JSON.parse(value), monedaActual);
    }
}

// Función para guardar un objeto en el Local Storage
function guardarItemStorage(item) {
    localStorage.setItem(item.nombre, JSON.stringify(item));
}

// Función para filtrar elementos en el historial
function filtrarHistorial() {
    const filtroNombre = document.querySelector("#filtro-nombre").value.toLowerCase();
    const elementosHistorial = document.querySelectorAll(".item-historial");

    elementosHistorial.forEach((elemento) => {
        const nombreProducto = elemento.querySelector("button").textContent.toLowerCase();
        if (nombreProducto.includes(filtroNombre)) {
            elemento.style.display = "block";
        } else {
            elemento.style.display = "none";
        }
    });
}

// Función que se ejecuta cuando se hace clic en el botón "Calcular"
async function tomarParametros(event) {
    event.preventDefault();
    const valorDolar = await obtenerValorDolar();

    const nombreProducto = document.querySelector("#input-nombre").value;
    const precioProducto = parseFloat(document.querySelector("#input-precio").value);
    const cuotasProducto = parseInt(document.querySelector("#input-cuotas").value);
    const interesProducto = parseFloat(document.querySelector("#input-interes").value);
    const interesDecimal = interesProducto / 100;
    totalAPagar = precioProducto + (precioProducto * interesDecimal);
    cuotaMensual = totalAPagar / cuotasProducto;

    if (!nombreProducto || isNaN(precioProducto) || isNaN(cuotasProducto) || isNaN(interesProducto)) {
        alert("Todos los campos son obligatorios y deben contener valores numéricos válidos");
        return;
    }

    mostrarItemHistorial(new Item(nombreProducto, precioProducto, cuotasProducto, interesProducto, valorDolar), monedaActual);

    document.querySelector("#input-nombre").value = "";
    document.querySelector("#input-precio").value = "";
    document.querySelector("#input-cuotas").value = "";
    document.querySelector("#input-interes").value = "";
}

// Event Listeners
document.querySelector("#calcular").addEventListener("click", tomarParametros);
document.querySelector("#monedas").addEventListener("change", cambiarMoneda);
document.querySelector("#filtro-nombre").addEventListener("keyup", filtrarHistorial);

// Cargar elementos del Local Storage al cargar la página
cargarItemsLocalStorage(monedaActual);
