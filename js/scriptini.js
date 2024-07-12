if (sessionStorage.getItem("usuarioEnLinea") != null){
    /* alert(sessionStorage.getItem("usuarioEnLinea")) */
    /* document.getElementById("iniciarSesionButton").innerText = "Cerrar sesion"; */
    document.getElementById("iniciarSesionButton").innerHTML = "<a class='linkNav iniciarSesion' id='iniciarSesionButton'>Cierra Sesión</a>";
    if (sessionStorage.getItem("esadmin",true)){
        document.getElementById("UsuarioEnLinea").innerHTML = "<a> Usuario : " + sessionStorage.getItem("usuarioEnLinea") + " </a>" +
        "<a class='linkNav admin' id='admin' href='./html/admin.html'>Administrador</a>";
    }else{
        document.getElementById("UsuarioEnLinea").innerHTML = "<a> Usuario : " + sessionStorage.getItem("usuarioEnLinea") + " </a>"; 
    };
   
    document.getElementById("iniciarSesionButton").addEventListener("click", miFunction);
}else{
    document.getElementById("iniciarSesionButton").innerHTML = "<a class='linkNav iniciarSesion' id='iniciarSesionButton' href='./html/iniciarSesion.html'>Iniciar Sesión</a>";
    document.getElementById("UsuarioEnLinea").innerText = '';
};

function miFunction(){
    sessionStorage.removeItem("usuarioEnLinea") ;
    sessionStorage.removeItem("esadmin") ;
    /* document.getElementById("iniciarSesionButton").innerText = "Iniciar sesion"; */
    document.getElementById("iniciarSesionButton").innerHTML = "<a class='linkNav iniciarSesion' id='iniciarSesionButton' href='./html/iniciarSesion.html'>Iniciar Sesión</a>";
    document.getElementById("UsuarioEnLinea").innerText = '';
    return false;
    
};