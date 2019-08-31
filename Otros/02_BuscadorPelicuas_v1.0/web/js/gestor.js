const url_ini = 'http://www.omdbapi.com/?t=';
const apiId = '&apikey=17e6747a';
const parafilm = '&plot=short&r=json';
const peli = 'star+wars'
function getJSONFromUrlGet(url) {

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        console.log(this.readyState);
        if (this.readyState == 4) {  
            if (this.status == 200) {
                var peliculas = JSON.parse(this.responseText);
                procesarPelicula(peliculas);
                alert("Entro");
            } else {
                var mens;
                if (this.status ==404){
                    mens = 'Busqueda no econtrada.';
                } else {
                    mens= "Error en el servidor.";
                }
                alert(mens);
            }
        }
    };
    //console.log(xmlhttp, url);
    xmlhttp.open("GET", url, true);
    xmlhttp.send();


}

function getJSON(url){
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function() {
        if (this.sreadyState == XMLHttpRequest.DONE){
            var peliculas = JSON.parse(this.responseText);
            procesarPelicula(pelicuas);
        }else{
            alert("Error");
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function cargarBusqueda(){
    var peliculaAbuscar = document.getElementById("peliABuscar").value;
    peliculaAbuscar= peliculaAbuscar.trim(); //quitamos espacio en blanco deltanteros y traseros.
    peliculaAbuscar =peliculaAbuscar.toLowerCase();
    //peliculaAbuscar= peliculaAbuscar.split(" ").join("+"); //remplacamos los espacio en blanco por el +
    
    var url = url_ini.concat(encodeURI(peliculaAbuscar), apiId);
    //url = encodeURI(url);
    console.log(url);
    getJSONFromUrlGet(url);
}
function procesarSeries(peliculas){
    console.log(peliculas);
    var arrayPeliculas = peliculas.peliculas;
    for(i=0; i<arrayPeliculas.length;i++){
        var pelicula = arrayPelicula[i];
        //crearficha(pelicula);
        console.log(pelicula);
    }
    
    
}