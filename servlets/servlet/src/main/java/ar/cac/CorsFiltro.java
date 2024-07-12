package ar.cac;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebFilter(urlPatterns = { "/*" })
public class CorsFiltro implements Filter {

	private List<String> origins = List.of("http://localhost:5500", "http://127.0.0.1:5500", "http://127.0.0.1:5500/html/iniciarSesion.html"); //spring
    //private List<String> origins = List.of(); //spring

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

			//esto viene desde el front
			String origin = ((HttpServletRequest) request).getHeader("origin");

			//ese front esta permido?
			if (origin != null && origins.contains(origin)) {
				((HttpServletResponse) response).addHeader("Access-Control-Allow-Origin", origin);
				((HttpServletResponse) response).addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
				((HttpServletResponse) response).addHeader("Access-Control-Allow-Headers", "*");
			}
			System.out.println("CorsFiltro: "+((HttpServletRequest) request).getMethod());
			chain.doFilter(request, response);

	}

}
