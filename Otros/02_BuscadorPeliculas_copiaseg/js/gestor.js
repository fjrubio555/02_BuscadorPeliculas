const url_ini = 'http://www.omdbapi.com/?';
const apiId = '&apikey=17e6747a';
const paramFilm = '&plot=full&r=json';
const valorador01 = 'Internet Movie Database';
const valorador02 = 'Rotten Tomatoes';
const valorador03 = 'Metacritic';
let msgmodal = document.getElementById('msgModal');
let flexmsgmodal = document.getElementById('msgFlex');
let abrirmsgmodal = document.getElementById('msgAbrir');
let cerrarmsgmodal = document.getElementById('msgCerrar');
let imgmodal = document.getElementById('imgModal');
let fleximgmodal = document.getElementById('imgFlex');
let abririmgmodal = document.getElementById('imgAbrir');
let cerrarimgmodal = document.getElementById('imgCerrar');
var arrayBusqueda = new Array;
var arrayFavor = new Array();


function getJSONFromUrlGet(busq,url) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // codigo para navegadores nuevos
        xmlhttp = new XMLHttpRequest();
    } else {
        // codigo para viejas versiones de navegadores de IE
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        var mens = '';
        if (this.readyState == 4) {
            if (this.status == 200) {
                var peliculas = JSON.parse(this.responseText);
                if (peliculas!=null && peliculas.Response!="False"){
                        procesarPelicula(busq,peliculas);
                        document.getElementById('contenedor_pelis').style.display='block';
                } else {
                    f_crearmodalmsg("Pelicula o serie no encontrada.");
                }
                
            } else {
                
                if (this.status == 404) {
                    mens = 'Busqueda de pelicula o serie fallida.';
                } else if (this.status == 500) {
                    mens= "Error en el servidor.";
                } else {
                    mens="No se ha podido establecer conexión con el servidor."
                }
                f_crearmodalmsg(mens);
            }
        } else if (this.readyState == 0){
            f_crearmodelmsg("No se ha podido establecer conexión");
            
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();


}

function cargarBusqueda(paramBusqueda) {
    
    if (paramBusqueda == null) {
        paramBusqueda = 's=';
    }
    var peliculaAbuscar = document.getElementById("peliABuscar").value;
    if (peliculaAbuscar!=null && peliculaAbuscar!=""){
        peliculaAbuscar = peliculaAbuscar.trim(); //quitamos espacio en blanco.
        peliculaAbuscar = peliculaAbuscar.toLowerCase();
        var url = url_ini.concat(paramBusqueda, encodeURI(peliculaAbuscar), apiId, paramFilm);
        getJSONFromUrlGet(true,url);
    } else {
        f_crearmodalmsg("Introduzca una pelicula o serie."); 
    } 
}

function procesarPelicula(busq,peliculas) {
    var arrayPeliculas = peliculas.Search;
    var bEncontrado;
    for (i = 0; i < arrayPeliculas.length; i++) {
        var pelicula = arrayPeliculas[i];
        bEncontrado=0;
            for(j=0; j<arrayBusqueda.length; j++){
                if (arrayPeliculas[i].imdbID==arrayBusqueda[j]){
                    bEncontrado=1;
                    break;
                }
            }
            if (bEncontrado==0){
                arrayBusqueda.push(pelicula.imdbID);
                crearficha(busq,pelicula);
                localStorage.setItem("arrayBusquedas", JSON.stringify(arrayBusqueda));
            }
    }
    
}

function crearficha(busq, pelicula) {
    var raiz;
    var imgPoster = document.createElement("img");
    if (busq==true){
        document.getElementById('btn-eliminarall').style.display="block";
        document.getElementById('fihapelis_pie').style.display="block";
        document.getElementById('ultimas_busquedas').innerHTML="Últimas Búsquedas";
        raiz = document.getElementById("ficha_pelis");
        imgPoster.setAttribute("fav",false);

    }else{
        document.getElementById('favoritos').innerHTML="Favoritos";
        document.getElementById('btn-eliminaral2').style.display="block";
        document.getElementById('fichafavor_pie').style.display="block";
        raiz = document.getElementById("ficha_favor");
        imgPoster.setAttribute("fav",true);
    }
    imgPoster.setAttribute("class", "poster_listado");
    imgPoster.setAttribute("src", pelicula.Poster);
    imgPoster.setAttribute("id","poster_listado");
    imgPoster.setAttribute("idoculto",pelicula.imdbID);
    imgPoster.setAttribute("onclick", "mionclick(this)");
    raiz.appendChild(imgPoster); 
}

function getPeliculaId(url,fav,cont_padre) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var peliculaId = JSON.parse(this.responseText);
                if (peliculaId!=null && peliculaId.Response!="False"){
                    f_cargarModalPelicula(peliculaId,fav,cont_padre);
                    
                } else {
                    f_crearmodalmsg("Pelicula o serie no encontrada.");
                }
                
            } else {
                
                if (this.status == 404) {
                    mens = 'Busqueda de pelicula o serie fallida.';
                } else if (this.status == 500) {
                    mens= "Error en el servidor.";
                } else {
                    mens="No se ha podido establecer conexión con el servidor."
                }
                f_crearmodalmsg(mens);
            }
        } else if (this.readyState == 0){
            f_crearmodelmsg("No se ha podido establecer conexión");
            
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function procesarPuntuacion(peliculaPunt) {
    var numPuntuacion = 0;
    if (peliculaPunt != null && peliculaPunt.Response!="False") {
            var arrayValoracion = peliculaPunt.Ratings;
            var valor;
            for (i = 0; i < arrayValoracion.length; i++) {
                if ((arrayValoracion[i].Source == valorador01) || (arrayValoracion[i].Source==valorador03)) {
                    valor = arrayValoracion[i].Value.split("/");
                    if (arrayValoracion[i].Source==valorador01) {
                        valor[0] = valor[0] * 10;
                    }
                } else if (arrayValoracion[i].Source==valorador02) {
                    valor = arrayValoracion[i].Value.split("%");
                }
                numPuntuacion = numPuntuacion + parseFloat(valor[0]);
            }
            numPuntuacion =parseFloat(numPuntuacion / arrayValoracion.length);
    }
    if (numPuntuacion.toString()=='NaN'){
        numPuntuacion=0;
    }
    return (numPuntuacion/10).toFixed(1);
}

//Funciones para la ventana modal de las peliculas
function f_cargarModalPelicula(peliculaModal,fav,cont_padre){

    if (peliculaModal != null && peliculaModal.Response!="False") {
        //CONTRUCTION DEL DOM
        var raiz;
        var raiz = document.getElementById("contenedor-imgModal");
        var raizaux;
        //Si no existe el nodo en cuestión se crea y se le añade al padre
        if (!document.getElementById("titulo-imgModal")){
            var raizaux = document.getElementById("cab-imgModal");
            var titulo_imgModal = document.createElement("h3");
            titulo_imgModal.setAttribute("id","titulo-imgModal")
            raizaux.appendChild(titulo_imgModal);
            var txtTitulo = document.createTextNode(peliculaModal.Title);
            titulo_imgModal.appendChild(txtTitulo);
        }else{ //Si existe solo lo modificamos añadiendo el titulo de la pelicula
            document.getElementById('titulo-imgModal').innerHTML=peliculaModal.Title;
        }
        if(!document.getElementById("poster_imgModal")){
            raizaux =document.getElementById("img-imgModal");
            var imgposter_imgModal = document.createElement("img");
            imgposter_imgModal.setAttribute("id","poster_imgModal");
            imgposter_imgModal.setAttribute("class","poster_imgModal");
            imgposter_imgModal.setAttribute("src",peliculaModal.Poster);
            raizaux.appendChild(imgposter_imgModal);
        }else{
            document.getElementById("poster_imgModal").src = peliculaModal.Poster;
        }
        if(!document.getElementById("p_director")){
            raizaux = document.getElementById("datos_imgModal");
            var pdirector = document.createElement("p");
            pdirector.setAttribute("id","p_director");
            pdirector.setAttribute("class","p-imgModal");
            raizaux.appendChild(pdirector);
            var txtDirector= document.createTextNode("Director: " + peliculaModal.Director);
            pdirector.appendChild(txtDirector);
        }else{
            document.getElementById('p_director').innerHTML= "Director: " + peliculaModal.Director;    
        }
        if(!document.getElementById("p_genero")){
            raizaux = document.getElementById("datos_imgModal");
            var pgenero = document.createElement("p");
            pgenero.setAttribute("id","p_genero");
            pgenero.setAttribute("class","p-imgModal");
            raizaux.appendChild(pgenero);
            var txtGenero= document.createTextNode("Género: " + peliculaModal.Genre);
            pgenero.appendChild(txtGenero);
        }else{
            document.getElementById('p_genero').innerHTML="Genero: " + peliculaModal.Genre;    
        }
        if(!document.getElementById("p_anyo")){
            raizaux = document.getElementById("datos_imgModal");
            var panyo = document.createElement("p");
            panyo.setAttribute("id","p_anyo");
            panyo.setAttribute("class","p-imgModal");
            raizaux.appendChild(panyo);
            var txtAnyo= document.createTextNode("Estreno: " + peliculaModal.Year);
            panyo.appendChild(txtAnyo);
        }else{
            document.getElementById('p_anyo').innerHTML="Estreno: " + peliculaModal.Year;    
        }
        if(!document.getElementById("p_sinop")){
            var psinop= document.createElement("p");
            raizaux = document.getElementById("datos_imgModal");
            psinop.setAttribute("id","p_sinop");
            psinop.setAttribute("class","p-imgModal");
            raizaux.appendChild(psinop);
            var txtSinop= document.createTextNode("Sinopsis: " +  peliculaModal.Plot);
            psinop.appendChild(txtSinop);
        }else{
            document.getElementById('p_sinop').innerHTML="Sinopsis: " + peliculaModal.Plot;    
        }
        if(!document.getElementById("punt-imgModal")){
            raizaux = document.getElementById("contenedor-imgModal");
            var divpuntModal = document.createElement("div");
            divpuntModal.setAttribute("id","punt-imgModal");
            divpuntModal.setAttribute("class","punt-imgModal");
            raizaux.appendChild(divpuntModal);
            var txtpuntnodo = document.createTextNode(procesarPuntuacion(peliculaModal) + "/10");
            divpieModal.appendChild(txtpuntnodo);
        }else{
            document.getElementById("punt-imgModal").innerHTML=procesarPuntuacion(peliculaModal)+ "/10";
        }
        document.getElementById("favor-imgModal").setAttribute("idoculto", peliculaModal.imdbID);
        document.getElementById('favor-imgModal').setAttribute('fav',false);
        document.getElementById("img-eliminaricon").setAttribute("idoculto", peliculaModal.imdbID);
        if (fav=="true"){
            document.getElementById('favor-imgModal').setAttribute('fav',true); 
        }else{
            document.getElementById('favor-imgModal').setAttribute('fav',false);
            document.getElementById('favor-imgModal').style.stroke = "#ffffff";
        }
        if (cont_padre==document.getElementById("ficha_favor")){
            document.getElementById('img-eliminaricon').style.display='none';
        }else{
            document.getElementById('img-eliminaricon').style.display='block';
        }
        for (i=0;i<arrayFavor.length;i++){
            if(peliculaModal.imdbID==arrayFavor[i]){
                document.getElementById('favor-imgModal').style.stroke = "#f1c40f";
                document.getElementById('favor-imgModal').setAttribute('fav',true);
                break;
            }
        }
        if (arrayFavor.length==0){
            document.getElementById('favor-imgModal').style.stroke = "#ffffff";
        }
        document.getElementById("imgModal").style.display = "block";   
    }   
}

function mionclick(element) {
    var _id =element.getAttribute("idoculto")
    var urlmodal = url_ini.concat("i=", _id.trim(), apiId, paramFilm);
    getPeliculaId(urlmodal, element.getAttribute('fav'),element.parentNode);
    
}
if (cerrarimgmodal){
         cerrarimgmodal.addEventListener('click', function(){
            imgmodal.style.display='none';
        });
}
window.addEventListener('click', function(ex){
    if(ex.target==fleximgmodal){
        imgmodal.style.display='none';
    }
});
//Eventos de la ventana modal de Mensajes.
function f_crearmodalmsg(mensg){
    document.getElementById('mensgModal').innerHTML=mensg;
    f_abrirmsgmodal();
}

function f_abrirmsgmodal(){
    msgmodal.style.display='block';
}

if (abrirmsgmodal) {
    abrirmsgmodal.addEventListener('click', function(){
        msgmodal.style.display='block';
    });
}
if (cerrarmsgmodal){
    cerrarmsgmodal.addEventListener('click', function(){
        msgmodal.style.display='none';
    });
}
window.addEventListener('click', function(e){
    if(e.target==flexmsgmodal){
        msgmodal.style.display='none';
    }
});

//Eventos para ejecutar la busqueda cuando se pulsa intro
function PulsarIntro(event){
    if (event.keyCode == 13 || event.which == 13){
        
        cargarBusqueda('s=');

    }
}

//Evento de cambio de orientacion pantalla
window.addEventListener("orientationchange", function() {
    if (screen.orientation.angle==90){
        if(screen.width>=1024 && screen.width<1366){
            document.getElementById('buscar_contenedor').style.top="20%";
            document.getElementById('buscar_contenedor').style.left="10%";
        } 
        if(screen.width>=1366){
            
            document.getElementById('buscar_contenedor').style.top="20%";
            document.getElementById('buscar_contenedor').style.left="30%";
        }

    }else{ 
        
        if(screen.orientation==0){
            if((screen.width>=470) && (screen.width<=900)){
                document.getElementById('buscar_contenedor').style.top="5%";
                document.getElementById('buscar_contenedor').style.left="5%";
            }
            if(screen.width>=1024){
            
                document.getElementById('buscar_contenedor').style.top="10%";
                document.getElementById('buscar_contenedor').style.left="10%";
            }
            if(screen.width<=320){
            
                document.getElementById('buscar_contenedor').style.top="5%";
                document.getElementById('buscar_contenedor').style.left="-5%";
                document.getElementById('.botonbuscar').style.marginRigh="3%";
            }
        }
        
    }
}, false);

//Borrar DOM
function BorrarDOM(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

//Borrar todas las busquedas realizadas.
function EliminarAllBusqueda(busq){
    var contenedorPelis;
    if (busq==true){
        document.getElementById('ultimas_busquedas').innerHTML=" ";
        document.getElementById('btn-eliminarall').style.display="none"; 
        document.getElementById('fihapelis_pie').style.display="none";  
        contenedorPelis = document.getElementById('ficha_pelis');
        BorrarDOM(contenedorPelis);
        arrayBusqueda.length=0;
        localStorage.setItem("arrayBusquedas", JSON.stringify(arrayBusqueda));
    }else{    
        document.getElementById('favoritos').innerHTML=" ";
        document.getElementById('btn-eliminaral2').style.display="none"; 
        document.getElementById('fichafavor_pie').style.display="none";  
        contenedorPelis = document.getElementById('ficha_favor');
        document.getElementById('poster_listado').setAttribute('fav',false);
        document.getElementById('favor-imgModal').setAttribute('fav',false);
        document.getElementById('favor-imgModal').style.stroke="white";
        BorrarDOM(contenedorPelis);
        arrayFavor.length=0;
        localStorage.setItem("arrayFavoritos", JSON.stringify(arrayFavor));
    }
}
//Borrar una busqueda del arrayBusqueda.
function Eliminar1Busqueda(element){
    arrayBusqueda = JSON.parse(localStorage.getItem("arrayBusquedas"));
    var bEncontrado=0;
    for(i=0; i<arrayBusqueda.length;i++){
            if (element.getAttribute("idoculto")==arrayBusqueda[i]){
                bEncontrado=1;
                //borramos del array el elemento seleccionado.
                arrayBusqueda.splice(i,1);
                break;
            }
    }
    if (bEncontrado==1){
        //Guardamos el array con todos los elementos salvo el eliminado.
        localStorage.setItem("arrayBusquedas", JSON.stringify(arrayBusqueda));
        //Recorremos el arbol DOM, y eliminar el nodo donde estaba el elemento a eliminar.
        var contenedorPelis = document.getElementById('ficha_pelis');
        for (i=0; i<contenedorPelis.childElementCount; i++){
            if(element.getAttribute('idoculto')==contenedorPelis.children[i].getAttribute('idoculto')){
                contenedorPelis.removeChild(contenedorPelis.children[i]);
                break;
            }
        }
        document.getElementById('imgModal').style.display='none';
    }
    //Si el ArrayBusquedas es 0 o nulo quitar la ficha pelicula.
    if (arrayBusqueda.length==0 || arrayBusqueda==null){
        document.getElementById('contenedor_pelis').style.display='none';
    }
}

function Eliminar1Favor(id){
    arrayFavor = JSON.parse(localStorage.getItem("arrayFavoritos"));
    var bEncontrado=0;
    for(i=0; i<arrayFavor.length;i++){
        if(id==arrayFavor[i]){
            bEncontrado=1;
            arrayFavor.splice(i,1);
            break;
        }
    }
    if (bEncontrado==1){
        localStorage.setItem("arrayFavoritos", JSON.stringify(arrayFavor));
        var contenedorFavor = document.getElementById('ficha_favor');
        for(i=0; i<contenedorFavor.childElementCount;i++){
            if(id==contenedorFavor.children[i].getAttribute('idoculto')){
                contenedorFavor.removeChild(contenedorFavor.children[i]);
                break;
            }
        }
        document.getElementById('imgModal').style.display='none';
    }
    if(arrayFavor.length==0 || arrayFavor==null){
        document.getElementById('contenedor_favor').style.display='none';
    }
}

function AddFavorito(element){
    var bFavor= document.getElementById('favor-imgModal').getAttribute('fav');

    if (bFavor=="false"){
        var _id =element.getAttribute("idoculto");
        var urlmodal = url_ini.concat("i=", _id.trim(), apiId, paramFilm);
        getPeliFavorId(false,urlmodal,);
        document.getElementById('poster_listado').setAttribute('fav',true);
        document.getElementById('favor-imgModal').setAttribute('fav',true);
        document.getElementById('imgModal').style.display='none';
        document.getElementById('contenedor_favor').style.display='block';
    }else{
        document.getElementById('poster_listado').setAttribute('fav',false);
        document.getElementById('favor-imgModal').setAttribute('fav',false);
        Eliminar1Favor(element.getAttribute("idoculto"));
    }
    
}

function getPeliFavorId(busq,url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var peliculaId = JSON.parse(this.responseText);
                if (peliculaId!=null && peliculaId.Response!="False"){
                    procesarPeliFavor(busq,peliculaId);
                } else {
                    f_crearmodalmsg("Pelicula o serie no encontrada.");
                }
                
            } else {
                
                if (this.status == 404) {
                    mens = 'Busqueda de pelicula o serie fallida.';
                } else if (this.status == 500) {
                    mens= "Error en el servidor.";
                } else {
                    mens="No se ha podido establecer conexión con el servidor."
                }
                f_crearmodalmsg(mens);
            }
        } else if (this.readyState == 0){
            f_crearmodelmsg("No se ha podido establecer conexión");
            
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function procesarPeliFavor(busq,pelicula) {
    var bEncontrado=0;
    for(i=0; i<arrayFavor.length;i++){
         if (pelicula.imdbID==arrayFavor[i]){
            bEncontrado=1;
            break;
        }
    }
    if (bEncontrado==0){
        arrayFavor.push(pelicula.imdbID);
        localStorage.setItem("arrayFavoritos", JSON.stringify(arrayFavor));
        crearficha(busq,pelicula);

    }
}

function CargarArrayBusqueda(){
    arrayBusquedaAux = JSON.parse(localStorage.getItem("arrayBusquedas")); 
    if (arrayBusquedaAux!=null && arrayBusquedaAux.length>0){
        arrayBusqueda=arrayBusquedaAux;
        for (i=0; i<arrayBusqueda.length;i++){
            var id = arrayBusqueda[i];
            var urlmodal = url_ini.concat("i=", id.trim(), apiId, paramFilm);
            getArrayId(urlmodal,true);
        }
    }
    arrayFavorAux = JSON.parse(localStorage.getItem("arrayFavoritos"));
    if(arrayFavorAux!=null && arrayFavorAux.length>0){
        arrayFavor=arrayFavorAux;
        for (i=0; i<arrayFavor.length;i++){
            var id = arrayFavor[i];
            var urlmodal = url_ini.concat("i=", id.trim(), apiId, paramFilm);
            getArrayId(urlmodal,false);
        }
    }
}

function getArrayId(url,busq) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var peliculaId = JSON.parse(this.responseText);
                if (peliculaId!=null && peliculaId.Response!="False"){
                    crearficha(busq,peliculaId);
                } else {
                    f_crearmodalmsg("Pelicula o serie no encontrada.");
                }
                
            } else {
                
                if (this.status == 404) {
                    mens = 'Busqueda de pelicula o serie fallida.';
                } else if (this.status == 500) {
                    mens= "Error en el servidor.";
                } else {
                    mens="No se ha podido establecer conexión con el servidor."
                }
                f_crearmodalmsg(mens);
            }
        } else if (this.readyState == 0){
            f_crearmodelmsg("No se ha podido establecer conexión");
            
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
/* Boton Arriba*/

