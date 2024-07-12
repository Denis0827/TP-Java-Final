    
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

    if (esValido == true) {
        sessionStorage.setItem("usuarioEnLinea", usuario);              //si es valido lo guardo en la variable de sesion
        sessionStorage.getItem("usuarioEnLinea");
    }

   
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
        errorElement.style.display = "block";
        element.style = "border:3px solid lightgrey ; animation-name: blinking; animation-duration: 1s;animation-iteration-count: 4;";
    } else {
        errorElement.style.display = "none";
        element.style.border = "2px solid var(--color-relleno)";
    }
}

/* Funcion de comunicacion con el API con POST */
/* datos mandados con la solicutud POST */

 function leoDatosDelApi(usuario, contrasena) {
    //document.getElementById('botonIniciarSesion').disabled = true;                     // deshabilito el boton de submit
    //document.getElementById('botonIniciarSesion').style = 'background-color:grey';     // lo muestro gris

    /* let _datos = {
        "email": `${usuario}`,
        "contrasena": "${contrasena}"
    };
     */
    
    // "http://127.0.0.1:8080/servlet/applogon"
    // datos mandados con la solicutud POST

    //ESTE FECTH FUNCIONA DE 10 - NO BORRAR - Usar de referencia
    //fetch('http://127.0.0.1:8080/servlet/applogon', {
    //    method: 'POST',
    //    headers:{
    //      'Content-Type': 'application/x-www-form-urlencoded'
    //    },    
    //    body: new URLSearchParams({
    //        'logon': 'test@gmail.com',
    //        'password': 'Password!',
    //        'grant_type': 'password'
    //    })
    //});

    fetch('http://127.0.0.1:8080/servlet/applogon', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },    
        body: new URLSearchParams({
            'email': `${usuario}`,
            'contrasena': `${contrasena}`
        })
    });



    //------------------------------------------------ Otro metodo para enviar datos POST --------------------------------
    //const xhr = new XMLHttpRequest();
    //xhr.open("POST", "http://localhost:8080/servlet/applogon");
    //xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    //const body = JSON.stringify({
    //    userId: 1,
    //    title: "Fix my bugs",
    //    completed: false
    //});
    //xhr.onload = () => {
    //    if (xhr.readyState == 4 && xhr.status == 201) {
    //        console.log(JSON.parse(xhr.responseText));
    //    } else {
    //        console.log(`Error: ${xhr.status}`);
    //    }
    //};
    //xhr.send(body);


}

/* Muestro el token que devuelve la api */
function data_function(data) {
    if (data.error == 'user not found') {
        alert('El email ingresado no existe en la API! Se dara por valido igual con fines de prueba');
    } else {
        alert(("La API devolvio este token - " + data.email));
    }

    estado = 1;
    document.getElementById('botonIniciarSesion').disabled = false;
    document.getElementById('botonIniciarSesion').style = 'var(--color-azul)';     // lo muestro normal azul
    verificoLogin();

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
