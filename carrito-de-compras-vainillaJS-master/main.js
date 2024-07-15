
const contenedor = document.getElementById(`contenedor-productos`)
const contenedorCarrito = document.getElementById(`carrito-contenedor`)
const botonTerminar = document.getElementById(`terminar`)
const finCompra = document.getElementById(`fin-compra`)
const contadorCarrito = document.getElementById(`contadorCarrito`)
const precioTotal = document.getElementById(`precioTotal`)
const btnComprar = document.getElementById("btnComprar")


let arrayCompras = []

let listaProductos;
fetch("productos.json").then((res)=>res.json()).then((data)=>listaProductos=data)



muestraProductos()

function muestraProductos(array){
    fetch("productos.json")
    .then((res)=>res.json())
    .then((data)=>data.forEach(element => {
        let div = document.createElement(`div`)
        div.classList.add(`producto`)
        

        div.innerHTML += `
        <div class="card m-2 mt-5 " style="width: 18rem;">
        <img src=${element.img} class="card-img-top" alt="imagen">
        <div class="card-body">
          <h5 class="card-title">${element.nombre}</h5>
          <h6 class="cuotas">${element.cuotas}</h6>
          <p class="card-text">$${element.precio} ARS</p>
          <a id="agregar${element.id}" class="btn btn-danger btnToast ">Comprar</a>
        </div>
      </div>`

      
      contenedor.appendChild(div)

      let btnAgregar = document.getElementById(`agregar${element.id}`)
      
      btnAgregar.addEventListener(`click`,()=>{  
          sumarCarrito(element.id)
          Toastify({
            text: "Producto agregado",
            duration: 3000,
            style: {
                background: "linear-gradient(to right, #28812f, #0d4f12)",
              }
            
            }).showToast();
      })
    }));
}




function sumarCarrito(id){
    let agregado = arrayCompras.find(e=>e.id == id) 
    if(agregado){
        agregado.cantidad += 1  
        document.getElementById(`und${agregado.id}`).innerHTML =`<p id=und${agregado.id}>Unidades:${agregado.cantidad}</p>`
        actualizarCarrito()
    }else{
        let productoAgregar = listaProductos.find(e=>e.id == id)


    productoAgregar.cantidad = 1
    
    arrayCompras.push(productoAgregar)

    actualizarCarrito()
    mostrarCarrito(productoAgregar)
    }

  localStorage.setItem(`carrito`, JSON.stringify(arrayCompras))
}





function mostrarCarrito(productoAgregar){
    let div = document.createElement(`div`)
    div.className=(`productoEnCarrito modal-body`)

    div.innerHTML=`
            <p>${productoAgregar.nombre}</p>
            <p>precio: $${productoAgregar.precio}</p>
            <p id="und${productoAgregar.id}">Unidades:${productoAgregar.cantidad}</p>
            <button id="eliminar${productoAgregar.id}" type="button" class="btn btn-danger">Eliminar</button>`
  
      contenedorCarrito.appendChild(div)

    let btnEliminar = document.getElementById(`eliminar${productoAgregar.id}`)

    btnEliminar.addEventListener(`click`,()=>{
        if(productoAgregar.cantidad == 1){
        btnEliminar.parentElement.remove()
        arrayCompras = arrayCompras.filter(e=>e.id != productoAgregar.id)
        actualizarCarrito()
        localStorage.setItem(`carrito`, JSON.stringify(arrayCompras))

        }else{
        productoAgregar.cantidad = productoAgregar.cantidad - 1
        document.getElementById(`und${productoAgregar.id}`).innerHTML =`<p id=und${productoAgregar.id}>Unidades:${productoAgregar.cantidad}</p>`
        actualizarCarrito()
        localStorage.setItem(`carrito`, JSON.stringify(arrayCompras))
        }
        
    })
}




function actualizarCarrito(){
    contadorCarrito.innerText = arrayCompras.reduce((acc,e)=> acc + e.cantidad,0)
    precioTotal.innerText = arrayCompras.reduce((acc,e)=> acc + (e.precio*e.cantidad),0)
}




recuperarLS()
function recuperarLS (){
    let recuperarstorage = JSON.parse(localStorage.getItem(`carrito`))

    if (recuperarstorage){
        recuperarstorage.forEach(e=>{
            mostrarCarrito(e)
            arrayCompras.push(e)
            actualizarCarrito()
        })
    } 
}




terminarCompra()
function terminarCompra (){

    btnComprar.addEventListener("click",()=>{
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success m-2',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Desea confirmar su compra?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, confirmar compra',
            cancelButtonText: 'No, quiero seguir viendo',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              arrayCompras = []
              localStorage.removeItem('carrito')
              actualizarCarrito()
              window.location.reload()
            }else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Compra cancelada',
                'Sigue viendo nuestros productos :)',
                
              )
            }
          })
    })

}




