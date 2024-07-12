package ar.cac;

import java.io.IOException;
import java.io.PrintWriter;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/appbuscarporid")
public class appbuscarporid extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    
        Integer id = Integer.valueOf(req.getParameter("patron"));
        usuario usr = new usuario();

        service srvc = new service();
        usr = srvc.buscarPorId(id);

        System.out.println("Usuario Encontrado: "+ usr.email);

        ObjectMapper mapper = new ObjectMapper();
        String lggJSON = mapper.writeValueAsString(usr);

        System.out.println(lggJSON);

        //envio respuesta al front end
        PrintWriter out = resp.getWriter();
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        out.print(lggJSON);
        out.flush();



    }


    
}
