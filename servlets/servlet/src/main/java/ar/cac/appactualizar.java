package ar.cac;

import java.io.IOException;
import java.io.PrintWriter;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// la forma de llamar al servlet sera http://localhost:8080/servlet/appactualizar
@WebServlet("/appactualizar")

public class appactualizar extends HttpServlet  {
    
@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        usuario usr = new usuario();
        usr.id = Integer.valueOf(req.getParameter("idd"));
        usr.nombre = req.getParameter("nombre");
        usr.apellido = req.getParameter("apellido");
        usr.email = req.getParameter("email");
        usr.contrasena = req.getParameter("contrasena");
        usr.fecnac = req.getParameter("fecnac");
        usr.pais = req.getParameter("pais");
        usr.activo =Boolean.parseBoolean(req.getParameter("activo"));
        usr.admin =Boolean.parseBoolean(req.getParameter("admin"));


        service srvc = new service();
        srvc.actualiza(usr);

        //envio respuesta al front end
        PrintWriter out = resp.getWriter();
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        out.print("DB actualizada ok");
        out.flush();

}

}
