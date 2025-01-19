const busqueda = document.querySelector(".formulario__busqueda");
const botonBuscar = document.querySelector(".barra-busqueda__boton");
const lugar = document.querySelector(".ubicacion__lugar");
const temp = document.querySelector(".contenedor__temperatura");
const humedad = document.querySelector(".humedad__valor");
const viento = document.querySelector(".viento__valor");
const respuestas = document.querySelector(".formulario__resultados");
const cerrarRespuestas1 = document.querySelector(".cerrar1");
const cerrarRespuestas2 = document.querySelector(".cerrar2");
const imgClima = document.querySelector(".imgClima");


botonBuscar.addEventListener("click", (e) => {
    if (busqueda.value == "") return
    buscarUbicacion(busqueda.value)

})
busqueda.addEventListener("keydown", (e) => {
    if (busqueda.value == "") {
        return
    }
    if (e.key === 'Enter') {
        e.preventDefault()
        buscarUbicacion(busqueda.value)
    }
})

function buscarUbicacion(ubiBuscada) {
    fetch(`https://nominatim.openstreetmap.org/search?q=${ubiBuscada}&format=json`)
        .then(res => res.json())
        .then(data => {

            if (data == "") {
                const li = document.createElement("li");
                li.textContent= "Ubicacion no encontrada"
                li.style.color = "#b81414"
                li.addEventListener("click",()=> cerrarRespuestas())
                respuestas.appendChild(li);
            }else{
                const fragmento = document.createDocumentFragment();
                for (let i = 0; i < data.length; i++) {
                    const li = document.createElement("li");
                    li.textContent = data[i]["display_name"];
                    fragmento.appendChild(li);

                    li.addEventListener("click", () => {
                        buscarClima(data[i]["lat"], data[i]["lon"])
                        cerrarRespuestas(true)
                    })
                }
                respuestas.appendChild(fragmento);
            }
            abrirRespuestas()
        })
}

cerrarRespuestas1.addEventListener("click", () => {
    cerrarRespuestas();
})
cerrarRespuestas2.addEventListener("click", () => {
    cerrarRespuestas();
})

function abrirRespuestas() {
    respuestas.style.display = "block";
    cerrarRespuestas1.style.display = "block";
    cerrarRespuestas2.style.display = "block";
}

function cerrarRespuestas(op) {
    respuestas.style.display = "none";
    cerrarRespuestas1.style.display = "none";
    cerrarRespuestas2.style.display = "none";
    respuestas.innerHTML = "";
    if (op) {
        busqueda.value = "";
    }
};


function buscarClima(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f57eac5c721f9c84f31b2cfa2d4adbb5`)
        .then(res => res.json())
        .then(data => {
            insertarDatos(data.name,
                data.main.temp,
                data.main.humidity,
                convertirSegKm(data.wind.speed),
                data.weather[0].icon)
        })
}

function convertirSegKm(velSeg) {
    const velKm = velSeg * 3.6
    return Math.trunc(velKm) + "km/h"
}

function insertarDatos(nombre, temperatura, hume, velocidad, idImg) {
    lugar.textContent = nombre;
    temp.textContent = Math.trunc(temperatura - 273.15)
    humedad.textContent = hume + "%";
    viento.textContent = velocidad;
    imgClima.src = `iconos/${idImg}.svg`
}


function obtenerIp() {
    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
            convertirIp(data.ip);
        })
        .catch(error => {
            console.error("Error al obtener la dirección IP:", error);
        });
}

function convertirIp(ip) {
    fetch(`https://ipapi.co/${ip}/json/`)
        .then(res => res.json())
        .then(data => {
            buscarClima(data.latitude, data.longitude)
        })
}

obtenerIp()