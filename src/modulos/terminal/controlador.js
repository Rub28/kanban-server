const db = require('../../DB/mysql')
const bcrypt = require('bcryptjs')

const TABLA = 'coi_terminal';

module.exports = function (dbinyectada) {

    let db = dbinyectada;

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(query) {
        console.log("query Todos ", query)
        if (query.roluser === "ADMIN") {
            return db.todos(TABLA, query)
        }
        if (query.roluser === "AGENTE") {
            return db.UsuariosAgente(TABLA, query)
        }
    }

    function uno(id) {
        return db.uno(TABLA, id);
    } 


/*  //  desde aqui se encripta la contraseña al agregar o actualizar un usuario
    async function agregar(body) {

        if(esHashBcrypt(body.user_password) == false){
            body.user_password = await bcrypt.hash(body.user_password, 5);
        }        
        return await db.agregar(TABLA, body);
    }
*/ 

function agregar(body){ 

        if (body.id != 0) {    
            body.fh_actualiza = new Date();
        }      
        console.log(" ** body en controlador agregar ", body);  
        return db.agregar(TABLA, body);
    }

    function baja(body) {
        return db.baja(TABLA, body);
    }



    function validaTerminal(body) {
        return db.validaTerminal(TABLA, body);
    }

    function esHashBcrypt(hash) {
        const regex = /^\$2[ayb]\$([0-9]{2})\$.{53}$/;
        return regex.test(hash);
      }

      function vendedorAutocomplete (query){
        return db.vendedorAutocomplete (query);
    }

    
      function usuarioAutocomplete (query){ 
        console.log(" en la controladora; ",  query)
        return db.usuarioAutocomplete (TABLA,query);
    }

    return {
        todos,
        uno,
        baja,
        agregar,
        validaTerminal,  
        vendedorAutocomplete, 
        usuarioAutocomplete 
    }
}