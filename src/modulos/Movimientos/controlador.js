const db = require('../../DB/mysql')

const TABLA ='pventa_movimiento';

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

    
    function Movimientos(body){
        console.log("body Movimientos: ", body)
        return db.Movimientos(TABLA, body)
    }
    
    function query(body){
        return db.query(TABLA, body);
    }
    
    
    function hitMaximo(body){
        return db.hitMaximo(TABLA, body);
    }
    
        
    function rendimientos(body){
        return db.rendimiento(TABLA, body);
    }
    
       function resumenMovimientos (body){
        return db.ResumenMovimientos(TABLA, body);
    }
    
    
    
    return {
        todos,
        uno,
        baja,
        agregar,
        Movimientos, 
        query, 
        hitMaximo, 
        rendimientos, 
        resumenMovimientos
    }
}