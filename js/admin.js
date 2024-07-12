
//Cuando se termina de cargar todo llama al listado por primera vez
 document.addEventListener('DOMContentLoaded', function() {
    let patron = "";
    obtenerListado(patron);
 }, false); 


var matriz =[]; //Asi defino el array para mantener lo que pedi a la db sin necesidad de pedir otra vez
var cadena;


document.getElementById("listar").addEventListener("click", event => {
    //alert("Listando");

    let patron = document.getElementById("filtro").value;
    console.log(patron);
    //var tabla;
    //const tabla =  obtenerListado(patron);
    obtenerListado(patron);
    //console.log(text[1].apellido); //NO FUNCIONA FUERA DEL obtenerListado
    
    
    console.log("-------------------------------click listar---------------------------------------------------")
    //console.log(tabla);
    //cargar(tabla);
    //console.log(tabla[0]["nombre"]);
    
    //let tabla2 = JSON.parse(tabla)
    //console.log(tabla);

    //mostrarListado(tabla);
});




async function obtenerListado(pat){

    let text;    
    try {
        const resp = await fetch('http://127.0.0.1:8080/servlet/applistar', {
                method: 'POST',
                headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
                },    
               body: new URLSearchParams({
                    'patron': `${pat}`                    
                })
                
            }
           
        )
        //.then(response => response.json())
        //.then (data => {Filas(data.data)});
        
                      
        text =  await resp.json(); //funciona perfecto
        
        matriz = text;

        //console.log(text[1].nombre);
        //console.log(Object.keys(text).length);
    
        //Armo la lista

        var cadena="";
        var color = "#CFFAF6";
        
        for (i=0; i < Object.keys(text).length; i++){
            //console.log(text[i]);
            var idd = text[i].id;
            var nom = text[i].nombre;
            var ape = text[i].apellido;
            var ema = text[i].email;
            var con = text[i].contrasena;
            var fec = text[i].fecnac;
            var pai = text[i].pais;
            var act = text[i].activo;
            var adm = text[i].admin;

            //cambia color por cada renglon
            if (color=="azure"){
                color="#CFFAF6";
            }else{
                color="azure";
            }

            //document.getElementById("datos").innerHTML = "Marcelo";
            //cadena = cadena + "<tr><td>"+idd+"</td><td>"+nom+"</td><td>"+ape+"</td></tr>";
            cadena = cadena + Fila(idd, nom, ape, ema, con,fec,pai,act,adm,color);
        };

        document.getElementById("datos").innerHTML = cadena;
        
    
    
        //FUNCIONO BIEN
        //.then(function(response) {
        //    return response.json();
        //  })
        //  .then(function(data) {
        //    var userid = data;//JSON.parse(data);
        //    console.log(userid);
        //    return userid;
        //  })


        //--------------------------------------------------------------------------------------------------------------------

    }catch (error){
        console.error(error);
        //console.log("No se ha podido crear ese usuario")
    };            
    return text;
}



function Fila(idd, nom, ape, ema, con,fec,pai,act,adm, color){
    
    return `
    <tr style="background:${color};">
        <td><button onclick="selecciona(${idd})">${idd}</button></td>
        <td>${nom}</td> 
        <td>${ape}</td> 
        <td>${ema}</td> 
        <td  class="escondetext">${con}</td> 
        <td>${fec}</td> 
        <td>${pai}</td> 
        <td>${act}</td> 
        <td>${adm}</td> 
        <td><button onclick="borraRegistro(${idd})">X</button></td>
    </tr>    
        `
};


async function borraRegistro(idd){
    console.log(idd);
    

    try {
        const resp = await fetch('http://127.0.0.1:8080/servlet/appborrar?id='+idd, {
                method: 'DELETE',
                headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
                },    
               //body: new URLSearchParams({
               //     'id': `${idd}`                    
               // })
            }
           
        )
        text = resp.text;
        console.log(text);

    //-----------------------------------------------------------------------------------------
    //try {
    //    const resp = await fetch('http://127.0.0.1:8080/servlet/appborrar', {
    //            method: 'POST',
    //            headers:{
    //            'Content-Type': 'application/x-www-form-urlencoded'
    //            },    
    //           body: new URLSearchParams({
    //                'id': `${idd}`                    
    //            })
    //           
    //        }
    //       
    //    )
        //.then(response => response.json())
        //.then (data => {Filas(data.data)});
        
                      
        
    }catch (error){
        console.error(error);
        //console.log("No se ha podido crear ese usuario")
    };
    obtenerListado("");            
        
};



async function selecciona(idd){
    console.log(idd);
    let text;
    try {
        const resp = await fetch('http://127.0.0.1:8080/servlet/appbuscarporid', {
                method: 'POST',
                headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
                },    
               body: new URLSearchParams({
                    'patron': `${idd}`                    
                })
                
            }
           
        )
        //.then(response => response.json())
        //.then (data => {Filas(data.data)});
        
                      
        text =  await resp.json(); //funciona perfecto
        //console.log(text[0].nombre);
        //console.log(Object.keys(text).length);
        console.log(text.email+" admin: "+text.admin);
        //return text;
                   
            document.getElementById("id").value = text.id;
            document.getElementById("nombre").value = text.nombre;
            document.getElementById("apellido").value = text.apellido;
            document.getElementById("email").value = text.email;
            document.getElementById("contrasena").value = text.contrasena;
            document.getElementById("fecnac").value = text.fecnac;
            document.getElementById("pais").value = text.pais;
            document.getElementById("activo").checked = text.activo;
            document.getElementById("admin").checked = text.admin;

        
    
    
        //FUNCIONO BIEN
        //.then(function(response) {
        //    return response.json();
        //  })
        //  .then(function(data) {
        //    var userid = data;//JSON.parse(data);
        //    console.log(userid);
        //    return userid;
        //  })


        //--------------------------------------------------------------------------------------------------------------------

    }catch (error){
        console.error(error);
        //console.log("No se ha podido crear ese usuario")
    };            
    return text;

    
};

function actualizar() {
    //console.log(matriz);

    let idd = document.getElementById("id").value;
    let nom = document.getElementById("nombre").value;
    let ape = document.getElementById("apellido").value;
    let ema = document.getElementById("email").value;
    let con = document.getElementById("contrasena").value;
    let fec = document.getElementById("fecnac").value;
    let pai = document.getElementById("pais").value;
    let act = document.getElementById("activo").checked;
    let adm = document.getElementById("admin").checked;

    

    //verifico que cada input tenga datos
    if (nom == "" || ape == "" || ema == "" || con == "" || fec == "" || pai == "" ){
        alert("Hay datos sin llenar");
        return;
    }
    
    //Verifico que el email sea el mismo
    //Como se lee la siguiente linea? buscar el email, tal que ese email sea igual al input de email
    const result = matriz.find(({ email }) => email == document.getElementById("email").value);
    //console.log(result); //result dara el registro donde encuentre el email para actualizar los datos o null para crear el registro nuevo si el email no existe
    console.log(result); //devuelve true o false

    if (!result){
        crearregistro( nom, ape, ema, con, fec, pai, act, adm);
    }else{
        actualizaregistro(idd, nom, ape, ema, con, fec, pai, act, adm);
        obtenerListado("")
    }
    obtenerListado("");  
    borrarcampos();

};

async function crearregistro(nom, ape, ema, con, fec, pai, act, adm){

    let text;    
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
                    'fecnac': `${fec}`,
                    'pais': `${pai}`,
                    'activo': `${act}`,
                    'admin': `${adm}`,
                })
                
            }
           
        )
        //.then(response => response.json())
        //.then (data => {Filas(data.data)});
        text = resp.text;
        console.log(text);

    }catch (error){

    }
    obtenerListado("");  
    borrarcampos();    
};

async function actualizaregistro(idd, nom, ape, ema, con, fec, pai, act, adm){


    let text;    
    try {
        const resp = await fetch('http://127.0.0.1:8080/servlet/appactualizar', {
                method: 'POST',
                headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
                },    
               body: new URLSearchParams({
                    'idd': `${idd}`,
                    'nombre': `${nom}`,
                    'apellido': `${ape}`,
                    'email': `${ema}`,
                    'contrasena': `${con}`,
                    'fecnac': `${fec}`,
                    'pais': `${pai}`,
                    'activo': `${act}`,
                    'admin': `${adm}`,
                })
                
            }
           
        )
        //.then(response => response.json())
        //.then (data => {Filas(data.data)});
        text = resp.text;
        console.log(text);

    }catch (error){

    };
    obtenerListado("");  
    borrarcampos()
};

function borrarcampos(){

    document.getElementById("id").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("email").value = "";
    document.getElementById("contrasena").value = "";
    document.getElementById("fecnac").value = "";
    document.getElementById("pais").value = "";
    document.getElementById("activo").checked = false;
    document.getElementById("admin").checked = false;

    obtenerListado("");  
};

function logout(){
    sessionStorage.removeItem("usuarioEnLinea");
    sessionStorage.removeItem("esadmin");
    window.location.href = "/";
};

function mostrarPSW(){
    
    let x = document.getElementById("contrasena");
    if (x.type === "password") {
        x.type = "text";
        escondeCampo("no");
    } else {
        x.type = "password";
        escondeCampo("si");
    }
};

function habilitaId(){
    
    let x = document.getElementById("id");
    if (x.disabled == true) {
        x.disabled = false;
    } else {
        x.disabled = true;
    }
};

function escondeCampo(esconde) {
   /*  if (esconde == "si"){
        document.getElementsByClassName("escondetext").style =  '{-webkit-text-security: none};';
        alert("esconder")
    }else{
        //document.getElementsByid("escondetext").style = "{-webkit-text-security: none};";
        document.getElementsByClassName("escondetext").style = '{-webkit-text-security: none};';
    }; */
};