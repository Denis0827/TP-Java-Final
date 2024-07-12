Trabajo Práctico Final de FrontEnd para Codo a Codo Java Full Stack.

https://marcelogarassino.github.io/CAC-TimeToTravel-FrontEnd-Final/index.html

Notas:  Al ingresar a la landing page, el usuario no estará logueado por lo que deberá iniciar sesión.
        Como nombre de usuario, ingresará un email con formato correcto (ej. ejemplo@email.com) y una contraseña compuesta
	de, al menos, un caracter en minúscula, un caracter en mayúscula, un número, y un tamaño mínimo de 8 caracteres.
	Comprobados los formatos de usuario y contraseña, se avisará al usuario en forma de texto y destello en rojo de el/los campos
	que no cumplan con el formato indicado.
	A continuación, se enviaran usuario y contraseña a la API 'https://reqres.in' (con metodo POST), para comprobar la existencia de estos
	datos en la base de datos de la api.

	los datos que se pueden mandar a la api y devuelven una busqueda positiva son:


  	E-mail			       Devuelve el token
    ------------------------------------------------------
    eve.holt@reqres.in			   QpwL5tke4Pnpja7X4
    george.bluth@reqres.in   		   QpwL5tke4Pnpja7X1   
    janet.weaver@reqres.in		   QpwL5tke4Pnpja7X2
    emma.wong@reqres.in			   QpwL5tke4Pnpja7X3
    charles.morris@reqres.in		   QpwL5tke4Pnpja7X5
    tracey.ramos@reqres.in 		   QpwL5tke4Pnpja7X6			

	No es necesaria una contraseña específica para que la api devuelva el token. Alcanza con enviar cualquier contraseña (ej: aA123bcd)
 
 Si el usuario es otro que los anteriores, el programa seguirá adelante a los fines de testeo, 
 y mostrará el usuario logueado en la landing page, hasta que este cierre sesion.
