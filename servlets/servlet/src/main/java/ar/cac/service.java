package ar.cac;


public class service {


    public usuario buscarPorId (Integer id){
        usuario usr = new usuario();
        usr = sql.buscarPorId(id);
        return usr;
    }

    public String listado (String patron){
        String json= sql.buscarPorPatron(patron);
        return json;
    }

    public void crear (usuario user){
        sql.agregarRegistro(user.nombre, user.apellido, user.email, user.contrasena, user.fecnac, user.pais,user.activo, user.admin);
    }

    public void elimina (Integer id){
        sql.borrarRegistro(id);
    }

    public void actualiza(usuario user){
        sql.actualizaRegistro(user.nombre, user.apellido, user.email, user.contrasena, user.fecnac, user.pais,user.activo, user.admin,user.id);
    }

    public usuario logon(usuario user){
        return sql.buscarLogin(user.email,user.contrasena);
    }


}
