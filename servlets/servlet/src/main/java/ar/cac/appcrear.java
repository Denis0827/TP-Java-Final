package ar.cac;


import java.io.IOException;
import java.io.PrintWriter;

import com.fasterxml.jackson.databind.ObjectMapper;

//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

 // la forma de llamar al servlet sera http://localhost:8080/servlet/appcrear
 @WebServlet("/appcrear")

public class appcrear extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        
        usuario usr = new usuario();

        usr.nombre = req.getParameter("nombre");
        usr.apellido = req.getParameter("apellido");
        usr.email = req.getParameter("email");
        usr.contrasena = req.getParameter("contrasena");
        usr.fecnac = req.getParameter("fecnac");
        usr.pais = req.getParameter("pais");
        usr.activo = true;
        usr.admin = Boolean.parseBoolean(req.getParameter("admin")); //ver 
        

        System.out.println("CREAR - Llego desde el front esto: "+usr.email);

        //Verifico que el email no existe
        String patron = usr.email;
        System.out.println("CREAR - Buscamos si existe: "+patron);
        service lst = new service();
        String usr2;
        usr2 = lst.listado(patron); //Devuelvo el json que se ajusta al patron

        //convierto usr2 de string a json
        


        System.out.println("CREAR - la busqueda devolvio JSON vacio de long 2 '[]': "+usr2.length());
        if (usr2.length() == 2){
            System.out.println("CREAR - no se encontro ese email por lo tanto crear!");
            service srvc = new service();

            System.out.println("CREAR - Como el email no existe, crea: "+usr.email);
            srvc.crear(usr);

            ObjectMapper mapper2 = new ObjectMapper();
                  
            String usr4JSON = mapper2.writeValueAsString(usr);

            //envio respuesta positiva al front end
            PrintWriter out = resp.getWriter();
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            out.print(usr4JSON);
            out.flush();

        }else{
             //El email fue encontrado asi que devuelvo error
             System.out.println("CREAR - Salida por #Error# email repetido ");
             usuario usr3 = new usuario();
             usr3.id = 0;
             usr3.email = "#Error#";
             usr3.contrasena = "#Error#";
             usr3.activo = false;
             usr3.admin = false;
 
 
             ObjectMapper mapper2 = new ObjectMapper();
                  
             String usr3JSON = mapper2.writeValueAsString(usr3);
     
             System.out.println("CREAR - Devuelve error, email encontrado: "+ usr3JSON);
 
             //envio respuesta positiva al front end
             PrintWriter out = resp.getWriter();
             resp.setContentType("application/json");
             resp.setCharacterEncoding("UTF-8");
             out.print(usr3JSON);
             out.flush();
        };
        
    }
}
