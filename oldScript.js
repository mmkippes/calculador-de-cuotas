const historial = []

function calcular() {
    let continuar = true;
    let cuotaMensual = 0;
    let totalAPagar = 0;

    while (continuar) {
        const nombreProducto = (prompt("Ingrese el nombre del producto:"));
        const valorProducto = parseFloat(prompt("Ingrese el valor del producto:"));
        const cuotas = parseInt(prompt("Ingrese la cantidad de cuotas:"));
        const tasaInteres = parseFloat(prompt("Ingrese la tasa de interés (%):"));

        if (isNaN(valorProducto) || isNaN(cuotas) || isNaN(tasaInteres)) {
            alert("Por favor, ingrese valores válidos.");
        } else {
            const interesDecimal = tasaInteres / 100;
            totalAPagar = valorProducto + (valorProducto * interesDecimal);
            cuotaMensual = totalAPagar / cuotas;

            alert(`Monto de la Cuota Mensual: $${cuotaMensual.toFixed(2)}\nTotal a Pagar: $${totalAPagar.toFixed(2)}`);
            document.getElementById("cuota").textContent = "$" + cuotaMensual.toFixed(2);
            document.getElementById("total").textContent = "$" + totalAPagar.toFixed(2);

            mostrarHistorial(nombreProducto, valorProducto, cuotas, tasaInteres, totalAPagar, cuotaMensual)
        }

        const respuesta = prompt("¿Desea realizar otro cálculo? (Si/No)").toLowerCase();
        if (respuesta !== "si") {
            continuar = false;
        }
    }
}

class Item {
    constructor(nombreProducto, valorProducto, cuotas, tasaInteres, totalAPagar, cuotaMensual) {
        this.nombreProducto = nombreProducto,
            this.valorProducto = valorProducto,
            this.cuotas = cuotas,
            this.tasaInteres = tasaInteres,
            this.totalAPagar = totalAPagar,
            this.cuotaFinal = cuotaMensual
    }
    mostrarEnConsola() {
        console.log(`${this.nombreProducto} valor: $${this.valorProducto}, en ${this.cuotas} cuotas con un interes de ${this.tasaInteres}%`)
        console.log(`↓↓↓↓↓↓↓↓↓↓ TOTAL A PAGAR ↓↓↓↓↓↓↓↓↓↓`)
        console.log(`$${this.totalAPagar} finales en ${this.cuotas} cuotas de $${this.cuotaFinal}`)
        console.log(`-----------------------------`)
    }
}

function mostrarHistorial(nombreProducto, valorProducto, cuotas, tasaInteres, totalAPagar, cuotaMensual) {
    historial.push(new Item(nombreProducto, valorProducto, cuotas, tasaInteres, totalAPagar, cuotaMensual))
    console.clear()
    console.log("Calculadora de cuotas")
    console.log(`-----------------------------`)
    historial.forEach((item) => {
        item.mostrarEnConsola()
    })
}