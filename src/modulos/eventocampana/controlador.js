const db = require('../../DB/mysql')

const TABLA ='chat_evento_campana';

module.exports = function(dbinyectada) {

    let db = dbinyectada;

    if(!db){
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.todos(TABLA)
    }
    
    function uno(id){
        return db.unoCampanaEvento (TABLA, id);
    }
    
    function agregar(body){
        return db.agregar(TABLA, body);
    }
    
    function baja(body){
        return db.baja(TABLA, body);
    }

       function actualiza (body){
        return db.actualizar (TABLA, body);
    }

    function ProductosAutocomplete(query){
        return db.ProductosAutocomplete(query);
    }

    function todosAgente(body){
        return db.todosAgente(TABLA, body);
    } 

    
    function eliminar(body){ 
        return db.eliminar(TABLA, body); 
    } 
    
    return {
        todos,
        uno,
        baja, 
        actualiza, 
        agregar,
        ProductosAutocomplete,
        todosAgente,
        eliminar
    }
}