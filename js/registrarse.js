var text;

document.getElementById("boton_enviar_registrarse").addEventListener("click", event => {
    event.preventDefault();         //evito el refresco al submitir para poder indicar el mensaje de error

    let error = false;
    let nom = document.getElementById("nombre").value;
    if (nom == ""  ){  error = true;  manejarErrores("nombre",false)};
    let ape = document.getElementById("apellido").value;
    if (ape == ""){  error = true;  manejarErrores("apellido",false)};
    let ema = document.getElementById("email").value;
    if (ema == ""){  error = true;  manejarErrores("email",false)};
    let con = document.getElementById("contrasena").value;
    if (con == ""){  error = true;  manejarErrores("contrasena",false)};
    let fec = document.getElementById("fechaDeNacimiento").value;
    if (fec == ""){  error = true;  manejarErrores("fechaDeNacimiento",false)};
    let pai = document.getElementById("pais").value;
    if (pai == ""){  error = true;  manejarErrores("pais",false)}; 

     // Verificar si el checkbox de términos y condiciones NO está marcado
    let checkbox = document.getElementById('terminos');
    if (!checkbox.checked) {
    error = true;
    }

    if (error == true){
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Complete todos los campos"
        });
    }else{
         //alert("Los campos estan llenos");
        manejarErrores("nombre",true);
        manejarErrores("apellido",true);
        manejarErrores("email",true);
        manejarErrores("contrasena",true);
        manejarErrores("fechaDeNacimiento",true);
        manejarErrores("pais",true);
        crearRegistro(nom, ape, ema, con, fec, pai);
    }


});

//funcion para manejar los errores
function manejarErrores(elementId, esValido) {
    const element = document.getElementById(elementId);
    
    
    resetAnimacion(elementId);

    if (!esValido) {                                                                     //si la variable esValido es falso muestro las alertas rojas
        
        element.style = "border:3px solid lightgrey ; animation-name: blinking; animation-duration: 1s;animation-iteration-count: 4;";
    } else {
        
        element.style.border = "2px solid var(--color-relleno)";
    }
}

function resetAnimacion(element) {
    
    var el = document.getElementById(element);
    el.style.animation = 'none';
    el.offsetHeight; /* trigger reflow */
    el.style.animation = null;
    return; 
}



async function crearRegistro (nom, ape, ema, con, fec, pai){

    try {
        const resp = await fetch('http://127.0.0.1:8080/servlet/appcrear', {
                method: 'POST',
                headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
                },    
                body: new URLSearchParams({
                    'nombre': `${nom}`,
                    'apellido': `${ape}`,
                    'email': `${ema}`,
                    'contrasena': `${con}`,
                    'fecnac':`${fec}`,
                    'pais':`${pai}`
                })
            });
        text = await resp.json();
        

        
        //const obj = await JSON.parse(text);
    
        }catch (error){
            //console.error(error);
            //console.log("No se ha podido crear ese usuario")
        }    

        try{
        console.log("CREAR - Llego esto del server: " + text.email + " email existente");
        
        if (text.email == "#Error#"){
             ///Alerta de mail existente
            Swal.fire({
                title: 'Error!',
                text: 'Email existente',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })     
            console.log("Error, Email existente");   
            return;   
        };
        }catch{

        };

        
         //Como la creacion fue exitosa y sin #Error# , limpio los campos
        if (text.email != "#Error#" ){
            //alerta de registro exitoso
            Swal.fire({
                title: "¡Registro exitoso!",
                text: "Su cuenta ha sido creada correctamente. Por favor, inicie sesión para continuar.",
                icon: "success",
                confirmButtonText: "Aceptar"
            });
        
        console.log("Se ha creado el usuario");
        
        document.getElementById("nombre").value="";
        document.getElementById("apellido").value="";
        document.getElementById("email").value="";
        document.getElementById("contrasena").value="";
        document.getElementById("fechaDeNacimiento").value="";
        document.getElementById("pais").value="";
        document.getElementById("terminos").checked = false; // Desmarcar el checkbox


        }
        
        
    

}