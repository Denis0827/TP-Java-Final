
let estado = 0;
document.getElementById("botonIniciarSesion").addEventListener("click", event => {
    event.preventDefault();         //evito el refresco al submitir para poder indicar el mensaje de error


    miFunction();                   /* miFunction(event);  */ /* Le paso el event a la funcion para hacer algo??????  */
    verificoLogin();
});


function verificoLogin() {
    if (sessionStorage.getItem("usuarioEnLinea") != null && estado == 1) {         //si existe una variable de session llamada 'usuarioEnLinea' el usuario se logeo con exito
        url_redirect('../index.html');                                        //entonces lo redirijo a la pagina principal
    };
}


function miFunction() {
    var usuario = document.getElementById('usuario').value;             //obtengo usuario del input
    var contrasena = document.getElementById('contrasena').value;       //obtengo la contraseña del input
    var salir = false;

    let esValido = validaEmail(usuario);                                //valido que el mail cumpla con ____@____.___
    let esValidPsw = validaContrasena(contrasena);
  
    manejarErrores("usuario", "errUsr", esValido);                      //se llama a la funcion manejar errores, donde se pasa el id , id del mensaje de error y la variable esValido
    manejarErrores("contrasena", "errPsw", esValidPsw);

    if (!esValido || !esValidPsw) {
        salir = true;
        return;                                                         //si existio algun error no continuo y espero a la proxima vez
    }

    /* buscamos del API si existen los datos ingresados */
    const resultado = leoDatosDelApi(usuario, contrasena);          //verifico si existe el mail contra la API. Lo hago en este momento,
                                                                    //ya que al ser una api de prueba no permite la comprobacion de la validez del
                                                                    //token devuelto desde las otras paginas de nuestro sitio.

    if (esValido == true) {
        //sessionStorage.setItem("usuarioEnLinea", usuario);              //si es valido lo guardo en la variable de sesion
        
        
    }

    return;
}

/* Valida el formato del email */

function validaEmail(usuario) {
    var formatoValido = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (usuario.match(formatoValido)) {
        return true;
    } else {
        return false;
    }
}

/* Valida la contraseña */
function validaContrasena(contrasena) {                      //Vamos a buscar al menos 1 mayuscula, 1 minuscula, 1 numero y 6 caracteres (8 caracteres como minimo)
    texto = contrasena.trim();
    mayusculas = false;
    minusculas = false;
    numeros = false;
    largo = false;

    for (i = 0; i < texto.length; i++) {
        if (texto[i] == texto[i].toUpperCase()) {
            mayusculas = true;
        }
        if (texto[i] == texto[i].toLowerCase()) {
            minusculas = true;
        }
        if (!isNaN(texto[i])) {
            numeros = true;
        }
    }

    if (texto.length >= 8) {
        largo = true;
    }

    if (minusculas && mayusculas && numeros && largo) {
        console.log('La contraseña es buena');
        return true;
    } else {
        console.log("La contraseña no sirve -" +
            "Minusculas: " + boolstr(minusculas) + " - " +
            "Mayusculas: " + boolstr(mayusculas) + " - " +
            "Numeros: " + boolstr(numeros) + " - " +
            "Largo: " + texto.length + " " + boolstr(largo))
        return false;
    }
}

function boolstr(val) {
    if (val == true) {
        return "true";
    } else {
        return "false";
    }
}


function resetAnimacion(element) {
    
    var el = document.getElementById(element);
    el.style.animation = 'none';
    el.offsetHeight; /* trigger reflow */
    el.style.animation = null;
    return; 
  }

//funcion para manejar los errores
function manejarErrores(elementId, errorId, esValido) {
    const element = document.getElementById(elementId);
    const errorElement = document.getElementById(errorId);
    
    resetAnimacion(elementId);

    if (!esValido) {                                                                     //si la variable esValido es falso muestro las alertas rojas
        Swal.fire({
            html: '<span style="font-size: 20px;">Acceso inválido. Por favor, inténtelo otra vez.</span>'
    });
    }
}

/* Funcion de comunicacion con el API con POST */
/* datos mandados con la solicutud POST */

async function leoDatosDelApi(usuario, contrasena) {
    document.getElementById('botonIniciarSesion').disabled = true;                     // deshabilito el boton de submit
    document.getElementById('botonIniciarSesion').style = 'background-color:grey';     // lo muestro gris

    let text;

    try {
    const resp = await fetch('http://127.0.0.1:8080/servlet/applogon', {
            method: 'POST',
            headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            },    
            body: new URLSearchParams({
               'email': `${usuario}`,
                'contrasena': `${contrasena}`
            })
        });

    text = await resp.json();
    

    //console.log("Fetch: "+ text.email);
    //Si el json contiene este msj de error, salgo
    if (text.email == "#Error#"){
        alert ("Usuario no encontrado.");
        document.getElementById('botonIniciarSesion').disabled = false;
        document.getElementById('botonIniciarSesion').style = 'var(--color-azul)';     // lo muestro normal azul

        return;
    };
    

    if (text.activo == false){
        console.log("El usuario no esta activo, consulte con el administrador");
        alert("El usuario no esta activo, consulte con el administrador");
        document.getElementById('botonIniciarSesion').disabled = false;
        document.getElementById('botonIniciarSesion').style = 'var(--color-azul)';     // lo muestro normal azul
        
        return;
    };

    if (text.admin == true){
         sessionStorage.setItem("esadmin",text.admin);
         
    };
    
    //Si llega hasta aca seguro fue encontrado en la DB, asi que lo cargo en la variable de sesion
    sessionStorage.setItem("usuarioEnLinea", text.email);


    //const obj = await JSON.parse(text);

    }catch (error){
        //console.error(error);
        console.log("No se ha encontrado ese usuario")
    };    

    estado = 1;
    verificoLogin();
    //data_function(text);
    return; 


}



function url_redirect(url) {                                                //funcion para volver a la landing page al loguear con exito
    var X = setTimeout(function () {
        window.location.replace(url);
        return true;
    }, 300);

    if (window.location = url) {
        clearTimeout(X);
        return true;
    } else {
        if (window.location.href = url) {
            clearTimeout(X);
            return true;
        } else {
            clearTimeout(X);
            window.location.replace(url);
            return true;
        }
    }
    return false;
};



function mostrarPSW() {                                                 //Checkbox para mostrar/ocultar la contraseña
    var x = document.getElementById("contrasena");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
