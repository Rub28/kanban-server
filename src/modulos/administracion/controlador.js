const db = require('../../DB/mysql')

const TABLA ='chat_msg_notifica';

module.exports = function(dbinyectada) {

    let db = dbinyectada;

    if(!db){
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.todos(TABLA)
    }

    function validauso(body){
        return db.validauso(TABLA, body);
    }   

    function obtieneExcepcionTipo(body){
        return db.obtieneValorCatalogo('coi_excep_tipo', body);
    }   

    function obtieneConceptos(body){
      //  return db.obtieneValorCatalogo('coi_concepto_tasa0_exento', body);
           return db.obtieneValorCatalogo(body.tabla, body);
    }
 
    function uno(id){ 

        return db.unoValorEmpresa(TABLA, id); 

    }
    
    function agregar(body){  
        // body.fh_registro = new Date(); 
        return db.agregar(TABLA, body); 
    }
    
    function eliminar (body){
        return db.eliminar (TABLA, body);
    } 


    function ClientesAutocomplete(query){
        return db.clientesAutocomplete(query);
    }

    function todosAgente(body){
        return db.todosAgente(TABLA, body);
    }
    return {
        todos,
        uno,
        eliminar,
        agregar,
        ClientesAutocomplete,
        validauso,
        todosAgente,  
        obtieneExcepcionTipo,  
        obtieneConceptos 
    }
}