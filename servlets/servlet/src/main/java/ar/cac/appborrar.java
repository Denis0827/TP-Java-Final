package ar.cac;

import java.io.IOException;
import java.io.PrintWriter;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// la forma de llamar al servlet sera http://localhost:8080/servlet/appborrar
 @WebServlet("/appborrar")
public class appborrar extends HttpServlet {
  
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("Entro en delete");
        //int borrar = Integer.parseInt(req.getParameter("id"));
        Integer borrar = Integer.valueOf(req.getParameter("id"));
        service srvc = new service();
   
        srvc.elimina(borrar);


        PrintWriter out = resp.getWriter();
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        out.print("Usuario borrado ok");
        out.flush();

    }

}
