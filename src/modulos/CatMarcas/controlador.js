const db = require('../../DB/mysql')

const TABLA ='coi_conceptos'; 

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

    function todosconceptos(body){
        return db.todosConceptos(TABLA, body);
    }
    return {
        todos,
        uno,
        baja,
        agregar,
        ProductosAutocomplete,
        todosconceptos 
    }
}