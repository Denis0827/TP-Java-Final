package ar.cac;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

 // la forma de llamar al servlet sera http://localhost:8080/servlet/applistar
 @WebServlet("/applistar")
public class applistar extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        
        String patron = req.getParameter("patron");
        System.out.println(patron);
        service lst = new service();
        resp.getWriter().println(lst.listado(patron)); //Devuelvo el json que se ajusta al patron
        
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String patron = req.getParameter("patron");
        System.out.println(patron);
        service lst = new service();
        resp.getWriter().println(lst.listado(patron)); //Devuelvo el json que se ajusta al patron
    }

}


