const db = require('../../DB/mysql')

const TABLA ='inventario_producto';

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

   function actualizaProrrateo (body){
        return db.actualizaProrrateo(TABLA, body);
    }

    function todosAgente(body){
        return db.inventarioproducto(TABLA, body);
    }
    return {
        todos,
        uno,
        baja,
        agregar,
        ProductosAutocomplete,
        todosAgente, 
        actualizaProrrateo 
    }
}