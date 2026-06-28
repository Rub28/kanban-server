
require('dotenv') 

// Desarrollo   
/* 
module.exports = {
    app: {
        port: process.env.PORT || 4001
    },
    jwt:{
        secret: process.env.JET_SECRET || 'miconstraseña2848330'
    },
    mysql:{
        host: process.env.MYSQL_HOST || 'localhost', 
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DB || 'bcoin_bd', 
        port: process.env.PORT_BD || 3306  
    }   
}     
 */ 

// Productvo 

module.exports = {
    app: {
        port: process.env.PORT || 4005 
    },
    jwt:{
        secret: process.env.JET_SECRET || 'miconstraseña2848330'
    },
    mysql:{
        host: process.env.MYSQL_HOST || '82.29.198.42',   // '127.0.0.1', // , solo por que ocupa de forma local, pero en produccion se conecta a la base de datos remota
        user: process.env.MYSQL_USER || 'u785010228_root',
        password: process.env.MYSQL_PASSWORD || 'rub11H28',
        database: process.env.MYSQL_DB || 'u785010228_pventa', 
        port: process.env.PORT_BD || 3306  
    }   
}         
 
