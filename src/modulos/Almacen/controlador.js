const db = require('../../DB/mysql')

const TABLA ='almacenes';

module.exports = function(dbinyectada) {

    let db = dbinyectada;

    if(!db){
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.todos(TABLA)
    }
    
    function uno(id){
        return db.uno(TABLA, id);
    }
    
    function agregar(body){
        return db.agregar(TABLA, body);
    }
    
    function baja(body){
        return db.baja(TABLA, body);
    }
    function ProductosAutocomplete(query){
        return db.ProductosAutocomplete(query);
    }

    function todosAgente(body){
        return db.todosAlmacenes( body);
    }
    return {
        todos,
        uno,
        baja,
        agregar,
        ProductosAutocomplete,
        todosAgente
    }
}