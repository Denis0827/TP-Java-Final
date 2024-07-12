package ar.cac;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Enumeration;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// la forma de llamar al servlet sera http://localhost:8080/servlet/applogon
@WebServlet("/applogon")
public class applogon extends HttpServlet {
    //@SuppressWarnings("rawtypes")
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        System.out.println("-------------Listar parametros entrantes POST----------------------------------------");
        ArrayList<String> parameterNames = new ArrayList<String>();
        Enumeration enumeration = req.getParameterNames();
        while (enumeration.hasMoreElements()) {
        String parameterName = (String) enumeration.nextElement();
        parameterNames.add(parameterName);
        }
        System.out.println(parameterNames);


        System.out.println("-----------------------------------------------------");
        String email = req.getParameter("email"); // cambiar email por logon para probar desde Insomnia
        System.out.println("LOGON - Llego este email del front : " + email);
        String contrasena = req.getParameter("contrasena");
        System.out.println("LOGON Llego este psw del front : " + contrasena);
      

        usuario usr = new usuario();
        usr.email= email;
        usr.contrasena= contrasena;
        usuario usr2; 
        service srvc = new service();
        usr2 = srvc.logon(usr);

        System.out.println("Se encontro este usuario en la DB: "+usr2.email+" - con su contrasena: "+usr2.contrasena+" - Es admin: "+usr2.admin);


        if (usr2.email == null){
            System.out.println("Salida por #Error# ");
            usr2.id = 0;
            usr2.email = "#Error#";
            usr2.contrasena = "#Error#";
            usr2.activo = false;
            usr2.admin = false;

        };
        
        ObjectMapper mapper2 = new ObjectMapper();
        logon lgg = new logon();

        lgg.id = usr2.id;
        lgg.email = usr2.email;
        lgg.contrasena = usr2.contrasena;
        lgg.activo = usr2.activo;
        lgg.admin = usr2.admin;

        String lggJSON = mapper2.writeValueAsString(lgg);

        System.out.println(lggJSON);

     

            //envio respuesta positiva al front end
            PrintWriter out = resp.getWriter();
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            out.print(lggJSON);
            out.flush();

        
        

       
    }

   
}
