const db = require('../../DB/mysql')

const TABLA ='cat_tasas_banco'; 

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
        console.log (" Agrega : ", body.data ) 
        
        return db.agregar(TABLA, body);
    }
    
    function baja(body){
        return db.baja(TABLA, body);
    }
    function ProductosAutocomplete(query){
        return db.ProductosAutocomplete(query);
    }

    function todosAgente(body){
        return db.todosAgente(TABLA, body);
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