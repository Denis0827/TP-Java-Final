package ar.cac;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.swing.JOptionPane;

import com.fasterxml.jackson.databind.ObjectMapper;  //JSON ejemplo del profe
import java.sql.Statement;



public class sql {
    
    /* ----------------------------------------------------------------------------------------------------------------------
     * Desde aca metodos de conexion 
     */

    // Establece la conexion con la DB
     public static Connection conectar() {

        
        Connection con = null;
        String base = "cacusuarios"; // Nombre de la base de datos
        String url = "jdbc:mysql://gara.ddns.net:3306/" + base; // Direccion, puerto y nombre de la Base de Datos
        String user = "MaGaRa"; // Usuario de Acceso a MySQL
        String password = "magmagmag"; // Password del usuario


        try {            
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(url, user, password);
            System.out.println("Conexion Exitosa");
        } catch (ClassNotFoundException | SQLException e) {
            System.err.println(e);
        }
        return con;
    }

    public static void desconectar(Connection conexion) {
        try{
            conexion.close();
            System.out.println("Desconexion Exitosa");
        }catch(Exception e) {
            System.err.println(e);
        }
    }

    /* ----------------------------------------------------------------------------------------------------------------------
     * Desde aca el CRUD
     */

    //-------------------------------------Leer/Buscar Registro unico------------------------------------------------------    
    public static usuario buscarPorId(Integer id) {
        Connection con;
        ResultSet rs = null;
        usuario usr = new usuario();

        try {
            con = conectar();
            PreparedStatement ps = con.prepareStatement("(SELECT usuarios.id, usuarios.nombre, usuarios.apellido, usuarios.email, " + 
                                "usuarios.contrasena, usuarios.fecnac, usuarios.pais, usuarios.activo, administradores.esadmin " + 
                                "FROM usuarios " + 
                                "LEFT JOIN administradores ON usuarios.id=administradores.usrid " + 
                                "WHERE (usuarios.id = ?) " + 
                                "ORDER BY usuarios.id) ;");
            ps.setInt(1, id);   // introducir aca el nro de Id a buscar en la DB - el 1 significa que es el primer '?' de la linea anterior 
            
            //ResultSet rs = ps.executeQuery();
            rs = ps.executeQuery();

            if (rs.next()) {

                //Se carga el objeto usuario con los datos recuperados de la DB
                
                usr.id=rs.getInt("id");
                usr.nombre = rs.getString("nombre");
                usr.apellido = rs.getString("apellido");
                usr.email = rs.getString("email");
                usr.contrasena = rs.getString("contrasena");
                usr.fecnac = rs.getString("fecnac");
                usr.pais = rs.getString("pais");
                usr.activo = rs.getBoolean("activo");
                usr.admin = rs.getBoolean("esadmin");
                
                desconectar(con);
            } else {
                JOptionPane.showMessageDialog(null, "No existe una persona con esa clave");
                // Mensaje de ALERTA por error la linea anterior                
            }
        } catch (SQLException e) {
            //Mensaje por error en la conexion
            System.err.println(e);
        }
        return usr;
    }

    //-------------------------------------Leer/Buscar multiples Registros ------------------------------------------------------
    // para llenar el ArrayList con objetos de clase usuario, creo los atributos en usuario.javacon sus getters y setters
    public static String buscarPorPatron(String patron) {
        Connection con;
        ResultSet rs = null;
        
        ObjectMapper mapper = new ObjectMapper();
        ArrayList<usuario> lista = new ArrayList<>();
        usuario usr;

        try {
            con = conectar();
            
            PreparedStatement ps = con.prepareStatement("(SELECT usuarios.id, usuarios.nombre, usuarios.apellido, usuarios.email," +
		            " usuarios.contrasena, usuarios.fecnac, usuarios.pais, usuarios.activo, administradores.esadmin  " +
                    "FROM usuarios " +
                    "LEFT JOIN administradores ON usuarios.id=administradores.usrid " +
                    "WHERE (nombre LIKE ?) OR (apellido LIKE ?) OR (email LIKE ?) " +
                    "ORDER BY usuarios.id);");
            ps.setString(1, "%"+patron+"%");
            ps.setString(2, "%"+patron+"%");
            ps.setString(3, "%"+patron+"%");
            rs = ps.executeQuery();

            

            // Leo uno a uno los registros traidos del la DB y los cargo en la lista
            while (rs.next()) {
                usr = new usuario();
                usr.setId(rs.getInt("id"));
                usr.setNombre(rs.getString("nombre"));
                usr.setApellido(rs.getString("apellido"));
                usr.setEmail(rs.getString("email"));
                usr.setContrasena(rs.getString("contrasena"));
                usr.setFecnac(rs.getString("fecnac"));
                usr.setPais(rs.getString("pais"));
                usr.setActivo(rs.getBoolean("activo"));
                usr.setAdmin(rs.getBoolean("esadmin"));

                lista.add(usr);
            }
            desconectar(con); //Desconecto de la DB

        } catch (SQLException e) {
            System.err.println(e);
        }
        

        //Crea el json
        String usrJSON;
        try {
            usrJSON = mapper.writeValueAsString(lista);
            //System.out.println(usrJSON);
            return usrJSON;
        } catch (Exception ex) {
            Logger.getLogger(sql.class.getName()).log(Level.SEVERE, null, ex);
        }
        return "Ocurrio un error al crear json";
    }

    //-------------------------------------Agregar Registro------------------------------------------------------
    public static void agregarRegistro(
        String nombre,
        String apellido,
        String email,
        String contrasena,
        String fecnac,
        String pais,
        Boolean activo,
        Boolean admin
    ) {
        Connection con;

        try {
            con = conectar();
            PreparedStatement ps = con.prepareStatement("INSERT INTO usuarios (Nombre, Apellido, Email, Contrasena, FecNac, Pais, activo) VALUES(?,?,?,?,?,?,?) ",
            Statement.RETURN_GENERATED_KEYS);

            ps.setString(1, nombre);
            ps.setString(2, apellido);
            ps.setString(3, email);
            ps.setString(4, contrasena);
            ps.setString(5, fecnac);
            ps.setString(6, pais);
            ps.setBoolean(7, activo);

            int res = ps.executeUpdate();

            if (res > 0) { 
                // Se obtiene el ID del usuario registrado
                ResultSet generatedKeys = ps.getGeneratedKeys();
                int usrid=-1;
                if (generatedKeys.next()) {
                    usrid = generatedKeys.getInt(1);
                }

                if (admin) {
                    PreparedStatement ps3 = con.prepareStatement("INSERT INTO administradores (usrid, esadmin) VALUES (?,?)");
                    ps3.setInt(1, usrid);
                    ps3.setBoolean(2, admin); // admin es el valor booleano

                    ps3.executeUpdate();
                }
            }


            desconectar(con);

        } catch (SQLException e) {
            System.err.println(e);
        }
    }


    //-------------------------------------Borra Registro------------------------------------------------------
    public static void borrarRegistro(Integer id) {

        Connection con;
        ResultSet rs1 = null;

        try {
            con = conectar();

            //verifico primero si es admin para borrarlo de la tabla Administradores
            PreparedStatement ps1 = con.prepareStatement("SELECT * FROM administradores WHERE usrid = ?");
            ps1.setInt(1, id);
            rs1 = ps1.executeQuery();

            if (rs1.next()) { // Si hay un resultado entro por aca a borrar

                System.out.println("3 - SQL Borra");
                PreparedStatement ps2 = con.prepareStatement("delete from administradores where usrid = ?");
                ps2.setInt(1, id);
                ps2.executeUpdate();
            };

            //ahora borro el usuario
            PreparedStatement ps = con.prepareStatement("DELETE FROM usuarios WHERE id=?");
            ps.setInt(1, id);   //El segundo integral es el ID que se borrara

            int res = ps.executeUpdate();


            desconectar(con);

        } catch (NumberFormatException | SQLException e) {
            System.err.println(e);
        }
    }


    //----------------------------------------Actualiza Registro---------------------------------------------
    public static void actualizaRegistro(
        String nombre,
        String apellido,
        String email,
        String contrasena, 
        String fecnac,
        String pais,
        Boolean activo, 
        Boolean admin,
        Integer id
    ) {

        Connection con;
        System.out.println("Actualizo registro - " + admin);
        try {
            con = conectar();
            PreparedStatement ps = con.prepareStatement("UPDATE usuarios SET nombre=?, apellido=?, email=?, contrasena=?, fecnac=?, pais=?, activo=? WHERE id=?");
            
            ps.setString(1, nombre);
            ps.setString(2, apellido);
            ps.setString(3, email);
            ps.setString(4, contrasena);
            ps.setString(5, fecnac);
            ps.setString(6, pais);
            ps.setBoolean(7, activo);
            ps.setInt(8, id);

            int res = ps.executeUpdate();

            compruebaAdmin(id, admin, con);

            
            desconectar(con);

        } catch (SQLException e) {
            System.err.println(e);
        }
    }

    //-------------------------------------Login------------------------------------------------------    
    public static usuario buscarLogin(String email, String contrasena) {
        Connection con;
        ResultSet rs = null;
        usuario usr = new usuario();
        Boolean admin = false;

        try {
            con = conectar();
            PreparedStatement ps = con.prepareStatement("SELECT * FROM usuarios WHERE email = ? AND contrasena = ?;");
            ps.setString(1, email);   // introducir aca el nro de Id a buscar en la DB - el 1 significa que es el primer '?' de la linea anterior 
            ps.setString(2, contrasena);


            rs = ps.executeQuery();

            if (rs.next()) {

                usr.id=rs.getInt("id");
                usr.nombre = rs.getString("Nombre");
                usr.apellido = rs.getString("apellido");
                usr.email = rs.getString("email");
                usr.contrasena = rs.getString("contrasena");
                usr.fecnac = rs.getString("fecnac");
                usr.pais = rs.getString("pais");
                usr.activo = rs.getBoolean("activo");
            
                ps = con.prepareStatement("SELECT * FROM administradores WHERE usrid = ?;");
                ps.setInt(1, usr.id);               
                rs = ps.executeQuery();
                
                if (rs.next()) {
                    admin = true;
                    usr.admin=admin;
                    System.out.println("Es administrador");
                }else{System.out.println("No es administrador");
                }

            } else {
                // Mensaje de ALERTA por error 
                System.out.println("No existe un usuario con esa clave.");
            }
            
            desconectar(con);

        } catch (SQLException e) {
            //Mensaje por error en la conexion
            System.err.println(e);
        }
        return usr;
    }

    //-------------------------------------Admin - comprueba si existe crea y borra------------------------------------------------------    
    public static void compruebaAdmin(Integer usrid, Boolean esadmin, Connection con){
       
        ResultSet rs1 = null;
        System.out.println("SQL - "+ usrid + " - "+ esadmin);
                
        try {

            PreparedStatement ps1 = con.prepareStatement("SELECT * FROM administradores WHERE usrid = ?");
            ps1.setInt(1, usrid);
            rs1 = ps1.executeQuery();

            if (rs1.next()) { // Si hay un resultado entro por aca a borrar

                System.out.println("3 - SQL Borra");
                PreparedStatement ps2 = con.prepareStatement("delete from administradores where usrid = ?");
                ps2.setInt(1, usrid);
                //Integer rs2 = ps2.executeUpdate();
                ps2.executeUpdate();
            } else {

                System.out.println("El resultset no contiene nada");// Si el resultset no contiene nada lo creo
                System.out.println("3 - SQL Crea");
                PreparedStatement ps3 = con
                        .prepareStatement("insert into administradores (usrid, esadmin) values (?,?)");
                ps3.setInt(1, usrid);
                ps3.setBoolean(2, esadmin);
                Integer rs3 = ps3.executeUpdate();
            }
            
            PreparedStatement ps4 = con.prepareStatement("ALTER TABLE administradores AUTO_INCREMENT = 1");
            Integer rs4 = ps4.executeUpdate();



        } catch (SQLException e) {
            System.err.println("Error " + e);
        }
        

    }

    

}
