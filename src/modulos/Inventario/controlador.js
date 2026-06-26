const db = require('../../DB/mysql')

const TABLA ='inventario';

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
        return db.InventarioAgente( body );
    }

    function inventarioLote (body){
        return db.inventarioLote( body );
    }
    
    return {
        todos,
        uno,
        baja,
        agregar,
        ProductosAutocomplete,
        inventarioLote,  
        todosAgente
    }
}