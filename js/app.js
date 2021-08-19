//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
//Eventos

eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntaPresupuesto);

    formulario.addEventListener('submit',agregarGasto);
}

//Clases
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevogasto(gasto){
        this.gastos = [...this.gastos,gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total,gasto) => total + gasto.cantidad, 0);
        this.restante =  this.presupuesto-gastado;
        console.log(this.restante);
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto( cantidad ){
        //Extrayendo los valores
        const {presupuesto,restante} = cantidad;
        //Agregando al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAletra (mensaje, tipo){
        //Crear el div 
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else {
            divMensaje.classList.add('alert-success')
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Insertar en el HTML 
        document.querySelector('.primario').insertBefore(divMensaje,formulario);

        //Quitar del HTML
        setTimeout(()=>{
            divMensaje.remove();
        },3000)
    }

    agregarGastoListado(gastos){
        
        this.limpiarHTML(); //Elimina el HTML previo


        //Iterar sobre los gastos 

        gastos.forEach(gasto => {
            const {nombre,cantidad,id}= gasto;

            //Crear un Li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            
            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'

            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnBorrar);
            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);

            
        });
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestObj){
        const {presupuesto,restante} = presupuestObj;
        
        const restanteDiv = document.querySelector('.restante');

        //Comprobar 25%
        if((presupuesto / 4) >= restante){
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if ((presupuesto/2) >= restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //Si el total es 0 o menor
        if(restante <= 0){
           ui.imprimirAletra('El presupuesto se ha agotado', 'error'); 
           formulario.querySelector('button[type="submit"]').disabled = true;
        }

    }
}


//Instanciar
const ui = new UI();
let presupuesto;

//Funciones
function preguntaPresupuesto(){
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');


    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <=0 ){
        window.location.reload();
    }

    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

//Añade gastos
function agregarGasto(event){
    event.preventDefault();

    //Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validar
    if(nombre === '' || cantidad === ''){
        ui.imprimirAletra('Todos los campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAletra('Cantidad inválida', 'error');
        return;
    }

    //generar un objeto con el gasto
    const gasto = {nombre, cantidad, id:Date.now()};
    presupuesto.nuevogasto(gasto);
    ui.imprimirAletra('Correcto');

    //Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    //Reinicia el formulario
    formulario.reset();

}


function eliminarGasto(id){
    //Elimina los gastos de los objetos
    presupuesto.eliminarGasto(id);

    // Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);

    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

}