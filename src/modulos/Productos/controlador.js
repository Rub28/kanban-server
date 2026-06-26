const db = require('../../DB/mysql')

const TABLA ='productos';

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
    function ClientesAutocomplete(query){
        return db.clientesAutocomplete(query);
    }

      function productoAutocomplete(query){
        return db.productoAutocomplete(TABLA, query);
    }

    function todosAgente(body){
        return db.todosAgente(TABLA, body);
    }

    function agregarImg(body){
        return db.agregar("img_producto", body);
    }
    
    function bajaImg(body){
        return db.baja("img_producto", body);
    }
    
    
    function todosAgenteImg(body){
        return db.todosAgenteProducto('img_producto', body);
    }

       
    function llenadocombo(body){
        return db.todos(body.tabla, body);
    }
 
    return {
        todos,
        uno,
        baja,
        agregar,
        ClientesAutocomplete,
        productoAutocomplete, 
        todosAgente,
        agregarImg,
        bajaImg,
        todosAgenteImg, 
        llenadocombo
    }
}