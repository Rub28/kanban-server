const mysql = require('mysql2/promise');
const config = require('../config');


let conexion; 

async function conexiondb() {
    let conexion;  // Definimos la variable de conexión fuera del try-catch
    try {
        // Crear un pool de conexiones
        const pool = mysql.createPool({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.password, 
         //   port: 3306, 
            port: config.mysql.port,    
            database: config.mysql.database,
            namedPlaceholders: true
        });
        console.log(" host : ", config.mysql.host); 
        console.log(" port:  ", config.mysql.port); 
        // Obtener una conexión del pool
        conexion = await pool.getConnection();

        console.log(" DB conectada, ok ");
        return conexion;

    } catch (err) {
        console.error('Error al conectar a la base de datos --> ', err);
    } finally {
        // Asegurarse de liberar la conexión si se ha establecido
        if (conexion) {
            conexion.release();
            console.log("Conexión liberada");
        }
    }
}

// Llamar a la función
conexiondb().then(conexion => {
    // Puedes usar la conexión para realizar consultas si la necesitas
}).catch(err => {
    console.error('Error:', err);
});

conexiondb();
/*
function todos(tabla) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} where estatus = 'A'`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}*/

async function todos (tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();
        console.log(" data en todos: ", data)   
        // Realizar la consulta usando async/await y execute
        const [result] = await conexion.execute(
            `SELECT * FROM ${tabla} WHERE estatus = ?`,
            [data.estatus]  // Parámetro 'A' para el estatus activo
        );

        // Retornar los resultados de la consulta
        return result;

    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error; // Lanzar el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión después de la consulta
        if (conexion) {            
            await conexion.close(); 
            console.log("Conexión liberada.");
        }
    }
}

async function obtieneValorCatalogo(tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();
        console.log(" data en obtieneValorCatalogo: ", data);  
        console.log("  tabla a consultar: ", tabla)
        // Realizar la consulta usando async/await y execute
        const [result] = await conexion.execute(
            `SELECT * FROM ${tabla} WHERE estatus = ? AND id_cliente = ?`,
            [data.estatus, data.id_cliente]  // Parámetro 'A' para el estatus activo
        );

        // Retornar los resultados de la consulta
        // console.log(" resultado en obtieneExcepcionTipo: ", result)  
       
        return result;

    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error; // Lanzar el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión después de la consulta
        if (conexion) {            
            await conexion.close(); 
            console.log("Conexión liberada.");
        }
    }
}

// Movimientos para Ordennes del CHAT  
async function movimientos (tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();
        console.log(" data en movimientos: ", data);  
        console.log("  tabla a consultar: ", tabla);  

        // Realizar la consulta usando async/await y execute
        const [result] = await conexion.execute(
            `SELECT * FROM ${tabla} WHERE estatus = ? AND id_cliente = ?  `,
            [data.estatus, data.id_cliente] ) // Parámetro 'A' para el estatus activo

        // Retornar los resultados de la consulta
        // console.log(" resultado en obtieneExcepcionTipo: ", result)  
       
        return result; 

    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error; // Lanzar el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión después de la consulta
        if (conexion) {            
            await conexion.close(); 
            console.log("Conexión liberada.");
        }
    }
}


// Movimientos para Ordennes del CHAT  
async function movimientosChat (tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();
        console.log(" data en movimientos: ", data);  
        console.log("  tabla a consultar: ", tabla);  
        
        const dates = new Date();   
        const fechaInicial = ''; 
        const fechaFin = ''; 

      if (data.rango === 'mensual')  {   
                let dates =  data.fecha ? new Date(data.fecha) : new Date();   

                const dia = dates.getDate().toString().padStart(2, '0');
                const mes = (dates.getMonth() + 1).toString().padStart(2, '0');
                const anio = dates.getFullYear();  // ya viene con 4 dígitos  

                // Concatenación con template literals (recomendado)
                const fechaFormateada = `${dia}/${mes}/${anio}`;

                // O con el operador +
                //  let fechaInicial = '01' + '/' + mes + '/' + anio;  
                 let fechaInicial = anio + '/'+ mes + '/' + '01';  
                console.log(" FechaIncial :", fechaInicial);  
             
               // O con el operador +
                    let fechaFin = anio + '/'+ mes + '/' + '30'; 
                    //let fechaFin = '30' + '/' + mes + '/' + anio; 
                console.log(" FechaFin :", fechaFin);      
        }   

        if (data.rango === 'semanal')  {  
            let dates =  data.fecha ? new Date(data.fecha) : new Date();
            const dia = dates.getDate().toString().padStart(2, '0');    
            const mes = (dates.getMonth() + 1).toString().padStart(2, '0');
            const anio = dates.getFullYear();  // ya viene con 4 dígitos    
            const fechaFormateada = `${dia}/${mes}/${anio}`;
            const fechaInicial = anio + '/'+ mes + '/' + dia;
            console.log(" FechaIncial :", fechaInicial);
            const fechaFin = new Date(dates);
            fechaFin.setDate(fechaFin.getDate() + 7);
            const diaFin = fechaFin.getDate().toString().padStart(2, '0');
            const mesFin = (fechaFin.getMonth() + 1).toString().padStart(2, '0');
            const anioFin = fechaFin.getFullYear();
            const fechaFinFormateada = `${diaFin}/${mesFin}/${anioFin}`;
            console.log(" FechaFin :", fechaFinFormateada);
        }   

        if (data.rango === 'diario')  { 
            let dates =  data.fecha ? new Date(data.fecha) : new Date();
            const dia = dates.getDate().toString().padStart(2, '0');
            const mes = (dates.getMonth() + 1).toString().padStart(2, '0');
            const anio = dates.getFullYear();  // ya viene con 4 dígitos
            const fechaFormateada = `${dia}/${mes}/${anio}`;
            const fechaInicial = anio  + '/'+  mes  + '/'+ dia; 
          
            const fechaFinDia = new Date(dates);
            fechaFinDia.setDate(fechaFinDia.getDate() + 1);  
            // const fechaFin = fechaFinDia.toISOString();    

            // const fechaFin = anio  + '/'+  mes  + '/'+ (parseInt(dia) + 1);    

            // Suponiendo que tienes anio, mes (1-12), dia (1-31) como números
            const fecha = new Date(anio, mes - 1, dia); // mes -1 porque Date usa 0-11
            fecha.setDate(fecha.getDate() + 1);        // suma un día (maneja cambios de mes/año)

            const anioFin = fecha.getFullYear();
            const mesFin = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const diaFin = fecha.getDate().toString().padStart(2, '0');
            const fechaFin = `${anioFin}/${mesFin}/${diaFin}`;
            
            console.log("  Opcion Diaria ");
            console.log(" fechaInicial :", fechaInicial);
            console.log(" fechaFin :", fechaFin);  

        }
 

        // Realizar la consulta usando async/await y executes
        const [result] = await conexion.execute (                           
            `SELECT * FROM chat_orden  
               WHERE id_empresa = ? 
                 and f_registro >= ?  `,  
            [data.id_empresa, fechaInicial]  // Parámetro 'A' para el estatus activo               
     /*       
 
     `SELECT * FROM chat_orden
               WHERE  id_empresa = ? 
               AND CONVERT_TZ(fh_registro, '+00:00', 'America/Mexico_City') >= ? 
               AND CONVERT_TZ(fh_registro, '+00:00', 'America/Mexico_City') < ? `,  
            [data.id_empresa, fechaInicial, fechaFin]  // Parámetro 'A' para el estatus activo  

            ` 
            SELECT * 
            FROM chat_orden
            WHERE id_empresa = ?
            AND fh_registro >= CONCAT(SUBSTRING_INDEX(?, '/', -1), '/',
                                        SUBSTRING_INDEX(SUBSTRING_INDEX(?, '/', 2), '/', -1), '/',
                                        SUBSTRING_INDEX(?, '/', 1))
            AND fh_registro <  CONCAT(SUBSTRING_INDEX(?, '/', -1), '/',
                                        SUBSTRING_INDEX(SUBSTRING_INDEX(?, '/', 2), '/', -1), '/',
                                        SUBSTRING_INDEX(?, '/', 1)) + INTERVAL 1 DAY 
                        `, 
                        [data.id_empresa, fechaInicial, fechaInicial, fechaInicial, fechaFin, fechaFin, fechaFin ]  // Parámetro 'A' para el estatus activo  
        */  

        ); 

        // Retornar los resultados de la consulta 
       // console.log("  --> resultado en movimientosChat ", result)     
       
        return result;

    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error; // Lanzar el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión después de la consulta
        if (conexion) {            
            await conexion.close(); 
            console.log("Conexión liberada.");
        }
    }
}



// Movimientos para Ordennes del CHAT  
async function entregaClienteschat (tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();
        console.log(" data en movimientos: ", data);  
        console.log("  tabla a consultar: ", tabla);  
        
        const dates = new Date();   
        const fechaInicial = ''; 
        const fechaFin = ''; 

      if (data.rango === 'mensual')  {   
                let dates =  data.fecha ? new Date(data.fecha) : new Date();   

                const dia = dates.getDate().toString().padStart(2, '0');
                const mes = (dates.getMonth() + 1).toString().padStart(2, '0');
                const anio = dates.getFullYear();  // ya viene con 4 dígitos  

                // Concatenación con template literals (recomendado)
                const fechaFormateada = `${dia}/${mes}/${anio}`;

                // O con el operador +
                //  let fechaInicial = '01' + '/' + mes + '/' + anio;  
                 let fechaInicial = anio + '/'+ mes + '/' + '01';  
                console.log(" FechaIncial :", fechaInicial);  
             
               // O con el operador +
                    let fechaFin = anio + '/'+ mes + '/' + '30'; 
                    //let fechaFin = '30' + '/' + mes + '/' + anio; 
                console.log(" FechaFin :", fechaFin);      
        }   

        if (data.rango === 'semanal')  {  
            let dates =  data.fecha ? new Date(data.fecha) : new Date();
            const dia = dates.getDate().toString().padStart(2, '0');    
            const mes = (dates.getMonth() + 1).toString().padStart(2, '0');
            const anio = dates.getFullYear();  // ya viene con 4 dígitos    
            const fechaFormateada = `${dia}/${mes}/${anio}`;
            const fechaInicial = anio + '/'+ mes + '/' + dia;
            console.log(" FechaIncial :", fechaInicial);
            const fechaFin = new Date(dates);
            fechaFin.setDate(fechaFin.getDate() + 7);
            const diaFin = fechaFin.getDate().toString().padStart(2, '0');
            const mesFin = (fechaFin.getMonth() + 1).toString().padStart(2, '0');
            const anioFin = fechaFin.getFullYear();
            const fechaFinFormateada = `${diaFin}/${mesFin}/${anioFin}`;
            console.log(" FechaFin :", fechaFinFormateada);
        }   

        if (data.rango === 'diario')  { 
            let dates =  data.fecha ? new Date(data.fecha) : new Date();
            const dia = dates.getDate().toString().padStart(2, '0');
            const mes = (dates.getMonth() + 1).toString().padStart(2, '0');
            const anio = dates.getFullYear();  // ya viene con 4 dígitos
            const fechaFormateada = `${dia}/${mes}/${anio}`;
            const fechaInicial = anio  + '/'+  mes  + '/'+ dia; 
          
            const fechaFinDia = new Date(dates);
            fechaFinDia.setDate(fechaFinDia.getDate() + 1);  
            // const fechaFin = fechaFinDia.toISOString();    

            // const fechaFin = anio  + '/'+  mes  + '/'+ (parseInt(dia) + 1);    

            // Suponiendo que tienes anio, mes (1-12), dia (1-31) como números
            const fecha = new Date(anio, mes - 1, dia); // mes -1 porque Date usa 0-11
            fecha.setDate(fecha.getDate() + 1);        // suma un día (maneja cambios de mes/año)

            const anioFin = fecha.getFullYear();
            const mesFin = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const diaFin = fecha.getDate().toString().padStart(2, '0');
            const fechaFin = `${anioFin}/${mesFin}/${diaFin}`;
            
            console.log("  Opcion Diaria ");
            console.log(" fechaInicial :", fechaInicial);
            console.log(" fechaFin :", fechaFin);  

        }
 

        // Realizar la consulta usando async/await y executes
        const [result] = await conexion.execute (                           
            `SELECT * FROM chat_orden  
               WHERE id_empresa = ? 
                 and f_registro >= ?  `,  
            [data.id_empresa, fechaInicial]  // Parámetro 'A' para el estatus activo               
     /*       
 
     `SELECT * FROM chat_orden
               WHERE  id_empresa = ? 
               AND CONVERT_TZ(fh_registro, '+00:00', 'America/Mexico_City') >= ? 
               AND CONVERT_TZ(fh_registro, '+00:00', 'America/Mexico_City') < ? `,  
            [data.id_empresa, fechaInicial, fechaFin]  // Parámetro 'A' para el estatus activo  

            ` 
            SELECT * 
            FROM chat_orden
            WHERE id_empresa = ?
            AND fh_registro >= CONCAT(SUBSTRING_INDEX(?, '/', -1), '/',
                                        SUBSTRING_INDEX(SUBSTRING_INDEX(?, '/', 2), '/', -1), '/',
                                        SUBSTRING_INDEX(?, '/', 1))
            AND fh_registro <  CONCAT(SUBSTRING_INDEX(?, '/', -1), '/',
                                        SUBSTRING_INDEX(SUBSTRING_INDEX(?, '/', 2), '/', -1), '/',
                                        SUBSTRING_INDEX(?, '/', 1)) + INTERVAL 1 DAY 
                        `, 
                        [data.id_empresa, fechaInicial, fechaInicial, fechaInicial, fechaFin, fechaFin, fechaFin ]  // Parámetro 'A' para el estatus activo  
        */  

        ); 

        // Retornar los resultados de la consulta 
       // console.log("  --> resultado en movimientosChat ", result)     
       
        return result;

    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error; // Lanzar el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión después de la consulta
        if (conexion) {            
            await conexion.close(); 
            console.log("Conexión liberada.");
        }
    }
}


/* 
function uno(tabla, id, estatus) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} where id=${id} and estatus = ${estatus}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}
*/ 

async function uno (tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();  
        console.log(" --> uno Tabla : ", tabla); 
        console.log(" --> data en uno : ", data)    

        // Realizar la consulta usando async/await y execute
        const [result] = await conexion.execute(
            `SELECT * FROM ${tabla} WHERE id = ?`,
            [data]  // Parámetro 'A' para el estatus activo
        );

        // Retornar los resultados de la consulta 
        console.log(" --> resultado en uno: ", result);  
        return result;

    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error; // Lanzar el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión después de la consulta
        if (conexion) {            
            await conexion.close(); 
            console.log("Conexión liberada.");
        }
    }
}

async function unoValorEmpresa (tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();  
        console.log(" --> uno Tabla : ", tabla); 
        console.log(" --> data en uno : ", data)    

        // Realizar la consulta usando async/await y execute
        const [result] = await conexion.execute(
            `SELECT * FROM ${tabla} WHERE id > 0 and id_empresa = ?`,
            [data]  // Parámetro 'A' para el estatus activo
        );

        // Retornar los resultados de la consulta 
        console.log(" --> resultado en uno: ", result);  
        return result;

    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error; // Lanzar el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión después de la consulta
        if (conexion) {            
            await conexion.close(); 
            console.log("Conexión liberada.");
        }
    }
}


async function clientesChat (tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();  
        console.log(" -->  clientesChat  data : ", data);   
        // Realizar la consulta usando async/await y execute
        const [result] = await conexion.execute(
            `SELECT * FROM ${tabla} WHERE id > 0  and id_empresa = ? and estatus = 'A' `,
            [data]  // Parámetro 'A' para el estatus activo
        );

        // Retornar los resultados de la consulta
        // console.log(" --> resultado en clientesChat: ", result); 

        return result;

    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error; // Lanzar el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión después de la consulta
        if (conexion) {            
            await conexion.close(); 
            console.log("Conexión liberada.");
        }
    }
}

async function unoCampanaEvento (tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();
        console.log(" data en unoCampanaEvento : ", data)   
        // Realizar la consulta usando async/await y execute
        const [result] = await conexion.execute(
            `SELECT * FROM ${tabla} WHERE id_campana = ?`,
            [data]  // Parámetro 'A' para el estatus activo
        );

        // Retornar los resultados de la consulta
        return result;

    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error; // Lanzar el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión después de la consulta
        if (conexion) {            
            await conexion.close(); 
            console.log("Conexión liberada.");
        }
    }
}


async function insertar(tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();


        // Ejecutar la consulta de inserción usando placeholders con nombre
        const [result] = await conexion.execute(
            `INSERT INTO ${tabla} SET ${Object.keys(data).map(key => `${key} = :${key}`).join(', ')}`,
            data // Pasar el objeto directamente, ya que estamos usando placeholders con nombre
        );
        
        // Retornar el resultado de la inserción
        console.log( " * Nuevo Valor insertado en: ", `  ${tabla} , :` + result.insertId)
        return result;

    } catch (error) {
        console.error("Error al insertar los datos:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
          
             await conexion.close(); 
            console.log("Conexión liberada tras la inserción");
        }
    }
}


async function eliminar (tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Ejecutar la consulta de inserción usando placeholders con nombre
        const [result] = await conexion.execute(
            `DELETE FROM ${tabla} WHERE id = ?`,
            [data]
        );
        
        // Retornar el resultado de la inserción
        console.log( " * Nuevo Valor insertado en: ", `  ${tabla} , :` + result.insertId)
        return result; 

    } catch (error) {
        console.error("Error al eliminar datos:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
          
             await conexion.close(); 
            console.log("Conexión liberada tras la inserción");
        }
    }
}


async function generaFolio(tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Insertamos el nuevo registro en la tabla de órdenes y obtenemos el ID generado  
        console.log(' generaFolio --> data: ', data);   

        const fechaActual = new Date(); 
        const año = fechaActual.getUTCFullYear().toString().slice(-2);
        const mes = (fechaActual.getUTCMonth() + 1).toString().padStart(2, '0');
        const dia = fechaActual.getUTCDate().toString().padStart(2, '0');
        const fechaRegistro = año + mes + dia; 

        data.prefijo_folio = fechaRegistro; // Agregar el prefijo al objeto de datos  

        const [result] = await conexion.execute(
            // `INSERT INTO chat_folio_orden SET ${Object.keys(data).map(key => `${key} = :${key}`).join(', ')}`,
           // data // Pasar el objeto directamente, ya que estamos usando placeholders con nombre

          `insert into  chat_folio_orden (id_orden,prefijo_folio) values  (?,?)`,
                         [data.id_orden, data.prefijo_folio]  

        );

        const nuevoId = result.insertId;     
        const folioGenerado = `${data.prefijo_folio}-${nuevoId.toString().padStart(4, '0')}`; 
        console.log("Folio generado: ", folioGenerado); 

            await conexion.execute( 
                                `update  ${tabla} set id_folio_orden = ? ,  folio_orden =  ? where id  =  ?  `,
                                      [nuevoId, folioGenerado, data.id_orden] 
                            ); 

        // verififcar si el cliente ya lo tenemos registrado como cliente frecuente, si no es así, lo agregamos a la tabla de clientes frecuentes 
            const [rows, fields] = await conexion.execute(
                `select * from chat_cliente where id > 0 and id_empresa = ? and phone_number = ? `,  
                         [data.id_empresa , data.phone_number]  
        );

        if (rows.length === 0) {  
            await conexion.execute( `insert into chat_cliente (nombre, id_empresa, phone_number, pushName ) values (?, ?, ?, ?)`,  
                            [data.pushName, data.id_empresa, data.phone_number, data.pushName]
            );  
        } 

        // Retornar el resultado de la inserción
        console.log( " * Nuevo Valor insertado en: ", `  ${tabla} , :` + result.insertId)
        return result;

    } catch (error) {
        console.error("Error al insertar los datos:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
          
             await conexion.close(); 
            console.log("Conexión liberada tras la inserción");
        }
    }
}


async function actualizaProrrateo(tabla, data) {
    let conexion;
    console.log(' Actualiza Prorrateo --> data: ', data);  

    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Ejecutar la consulta de actualización usando placeholders con nombre
        const [result] = await conexion.execute(
         //   `UPDATE ${tabla} SET ${Object.keys(data).map(key => `${key} = :${key}`).join(', ')}  WHERE id_inventario = :id_inventario `, 
            ` UPDATE ${tabla}  SET  costo_transporte = (:costoTransporte / :totalCostolote) * costo_interno,  
                                    costo_total =  costo_transporte + costo_interno, 
                                    precio_ideal = costo_total * 1.5,  
                                    precio_minimo = costo_total * 1.3,   
                                    precio_mayoreo = costo_total * 1.2   
               WHERE estatus = 'A'
                 and id_inventario = :id_inventario  `,  
                data // Pasar el objeto directamente  
        ); 

           const [result1] = await conexion.execute(
         //   `UPDATE ${tabla} SET ${Object.keys(data).map(key => `${key} = :${key}`).join(', ')}  WHERE id_inventario = :id_inventario `, 
            ` UPDATE inventario SET  precio_compra = :totalCostolote ,  
                                     precio_compra_lote = :totalCostolote,  
                                     stock_total = :stock_total
               WHERE estatus = 'A'
                 and id = :id_inventario  `,  
                data // Pasar el objeto directamente  
        ); 

        // Retornar el resultado de la actualización
        return result; 

    } catch (error) {
        console.error("Error al actualizaProrrateo los datos:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras la actualización");
        }
    }
}


async function actualizar(tabla, data) {
    let conexion;
    console.log(' actualizar --> data: ', data);  

    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Ejecutar la consulta de actualización usando placeholders con nombre
        const [result] = await conexion.execute(
            `UPDATE ${tabla} SET ${Object.keys(data).map(key => `${key} = :${key}`).join(', ')} WHERE id = :id `, 
        data // Pasar el objeto directamente  
        ); 

        // Retornar el resultado de la actualización
        return result;

    } catch (error) {
        console.error("Error al actualizar los datos:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras la actualización");
        }
    }
}
  
function agregar(tabla, data) {
    console.log(' en agregar --> data: ', data); 
    if (data && data.id == 0) {
        return insertar(tabla, data);
    } else {
        return actualizar(tabla, data);
    }
}  
    
function agregarArray(tabla, data) {

    console.log(' *  data Array : ', data); 
    const productos  =  data;  
    var resultado = "";  

    for (const producto of productos  ) { 

        if ( producto.id == 0) {
           resultado =  insertar(tabla, producto);
        } else {
           resultado =  actualizar(tabla, producto);
        }
 
    } 
    return resultado; 
}

async function baja(tabla, consulta) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades como 'user_name' y 'user_password'
        console.log(" baja --> ", consulta); 
          
        const parametros = [consulta.estatus, consulta.id];
        console.log(" parametros ", parametros)
        // Ejecutar la consulta usando los parámetros en un array
        const [result] = await conexion.execute(
            `UPDATE ${tabla} SET estatus = ? where id = ?`,
            parametros // Pasar los parámetros como un array
        );

        // Retornar el primer resultado (suponiendo que solo hay uno)
        return result || null; // Si no hay coincidencias, se devuelve null

    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras baja");
        }
    }
}


async function query(tabla, consulta) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Realizar la consulta utilizando placeholders con nombre
        const [result] = await conexion.execute(
            `SELECT * FROM ${tabla} WHERE ?`, 
            consulta  // Aquí 'consulta' es un objeto que se mapea directamente
        );

        // Retornar el primer resultado si existe
        return result.length > 0 ? result : null;

    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error; // Lanzar el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión después de la consulta
        if (conexion) {
            
            await conexion.close(); 
            console.log("Conexión liberada.");
        }
    }
}

async function Movimientos(tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        console.log(" **  Movimientos  Tipo usuario : ", data.roluser);  
  
        // Acción para el rol "AGENTE"
        if (data.roluser === "VENDEDOR") {
            const [result] = await conexion.execute(
                `  SELECT m.id, C.id as Id_cliente,  nom_cliente,  m.fh_venta, m.estatus, m.cantidad, m.imp_total,   
                          m.imp_neto, m.imp_iva, m.imp_otros,                   
                          p.id as id_pago,  p.forma_pago, e.id as id_entrega,  e.forma_entrega, pr.nombre as nom_producto,   
                          C.id_agente, concat(u.firt_name,' ',u.second_name) nom_vendedor,  m.notas  
                        FROM  pventa_movimiento AS m
                        INNER JOIN  clientes AS C
                                ON  m.id_cliente = C.id 
                        INNER JOIN users AS u 
                                ON  m.id_vendedor = u.id              
                        INNER JOIN tipo_pago AS p 
                                ON  m.id_pago = p.id             
                        INNER JOIN tipo_entrega AS e 
                                ON  m.id_entrega = e.id      
                        INNER JOIN productos AS pr 
                                ON  m.id_producto = pr.id                  
                        WHERE m.estatus = ? AND C.id_agente =  ?  
                          and u.id_sucursal =  ?  `, 
                        [data.estatus, data.id_agente, data.id_sucursal] 
            );
            return result;
        }
 
        // Acción para el rol "ADMIN"
        if (data.roluser === "ADMIN") {  
            if (data.id_sucursal === "0")  { 
                 const [result] = await conexion.execute(
                `  SELECT m.id, C.id as Id_cliente,  nom_cliente,  m.fh_venta, m.estatus, m.cantidad, m.imp_total,  
                          m.imp_neto, m.imp_iva, m.imp_otros,   
                           p.id as id_pago,  p.forma_pago, e.id as id_entrega,  e.forma_entrega, pr.nombre as nom_producto, 
                        C.id_agente, concat(u.firt_name,' ',u.second_name) nom_vendedor,  m.notas  
                        FROM  pventa_movimiento AS m
                        INNER JOIN  clientes AS C
                                ON  m.id_cliente = C.id 
                        INNER JOIN users AS u 
                                ON  m.id_vendedor = u.id              
                        INNER JOIN tipo_pago AS p 
                                ON  m.id_pago = p.id               
                        INNER JOIN tipo_entrega AS e 
                                ON  m.id_entrega = e.id      
                        INNER JOIN productos AS pr
                                ON  m.id_producto = pr.id                  
                            WHERE m.estatus = ? `,
                          [data.estatus]  // Asumimos que un ADMIN puede consultar todos los agentes con el estatus dado
            );
            return result;  
             }  else  { 
                    const [result] = await conexion.execute(
                        `  SELECT m.id, C.id as Id_cliente,  nom_cliente,  m.fh_venta, m.estatus, m.cantidad, m.imp_total,  
                                m.imp_neto, m.imp_iva, m.imp_otros,   
                                p.id as id_pago,  p.forma_pago, e.id as id_entrega,  e.forma_entrega, pr.nombre as nom_producto, 
                                C.id_agente, concat(u.firt_name,' ',u.second_name) nom_vendedor,  m.notas  
                                FROM  pventa_movimiento AS m
                                INNER JOIN  clientes AS C
                                        ON  m.id_cliente = C.id 
                                INNER JOIN users AS u 
                                        ON  m.id_vendedor = u.id              
                                INNER JOIN tipo_pago AS p 
                                        ON  m.id_pago = p.id               
                                INNER JOIN tipo_entrega AS e 
                                        ON  m.id_entrega = e.id      
                                INNER JOIN productos AS pr
                                        ON  m.id_producto = pr.id                  
                                    WHERE m.estatus = ? and u.id_sucursal = ? `,
                                    [data.estatus, data.id_sucursal]  // Asumimos que un ADMIN puede consultar todos los agentes con el estatus dado
                    );
                    return result; 

              }

        }

        // Acción para el rol "CLIENTE"  **Pendiente de definir   
        if (data.roluser === "CLIENTE") { 
            console.log(" CLiente: ", data.id_cliente)
            const [result] = await conexion.execute(
                ` SELECT m.id, c.id as Id_cliente, m.num_hit, nom_cliente, monto_entrada, fecha_entrada, valor_bcoin, precio_inicial, precio_final, m.monto_salida,
                    m.fecha_salida, m.utilidad_perdida, m.estatus, m.num_round, m.notas, c.id_agente
                    FROM  movimientos AS m
                        INNER JOIN  clientes AS c
                                ON  m.id_cliente = c.id 
                             WHERE  c.id = ? `,
                            [data.id_cliente]  // Los clientes solo pueden ver sus propios movimientos 

            );   
            return result;
        } 
     
        // Si el rol no es válido
        throw new Error("Rol no reconocido para realizar la consulta.");

    } catch (error) {
        console.error("Error en la consulta de movimientos:", error);
        throw error; // Lanza el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras la consulta.");
        }
    }
}


async function MovimientosPorPeriodo (tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        console.log(" **  Movimientos  Tipo usuario : ", data.roluser);  

        // Acción para el rol "AGENTE"
        if (data.roluser === "VENDEDOR") {
            const [result] = await conexion.execute(
                `  SELECT m.id, C.id as Id_cliente,  nom_cliente,  m.fh_venta, m.estatus, m.cantidad, m.imp_total,   
                          m.imp_neto, m.imp_iva, m.imp_otros,                   
                          p.id as id_pago,  p.forma_pago, e.id as id_entrega,  e.forma_entrega, pr.nombre as nom_producto,   
                          C.id_agente, concat(u.firt_name,' ',u.second_name) nom_vendedor,  m.notas  
                        FROM  pventa_movimiento AS m
                        INNER JOIN  clientes AS C
                                ON  m.id_cliente = C.id 
                        INNER JOIN users AS u 
                                ON  m.id_vendedor = u.id              
                        INNER JOIN tipo_pago AS p 
                                ON  m.id_pago = p.id               
                        INNER JOIN tipo_entrega AS e 
                                ON  m.id_entrega = e.id      
                        INNER JOIN productos AS pr
                                ON  m.id_producto = pr.id                  
                        WHERE m.estatus = ? AND C.id_agente =  ?`, 
                        [data.estatus, data.id_agente]
            );
            return result;
        }

        // Acción para el rol "ADMIN"
        if (data.roluser === "ADMIN") {
            const [result] = await conexion.execute(
                `  SELECT m.id, C.id as Id_cliente,  nom_cliente,  m.fh_venta, m.estatus, m.cantidad, m.imp_total,  
                          m.imp_neto, m.imp_iva, m.imp_otros,   
                           p.id as id_pago,  p.forma_pago, e.id as id_entrega,  e.forma_entrega, pr.nombre as nom_producto, 
                        C.id_agente, concat(u.firt_name,' ',u.second_name) nom_vendedor,  m.notas  
                        FROM  pventa_movimiento AS m
                        INNER JOIN  clientes AS C
                                ON  m.id_cliente = C.id 
                        INNER JOIN users AS u 
                                ON  m.id_vendedor = u.id              
                        INNER JOIN tipo_pago AS p 
                                ON  m.id_pago = p.id               
                        INNER JOIN tipo_entrega AS e 
                                ON  m.id_entrega = e.id      
                        INNER JOIN productos AS pr
                                ON  m.id_producto = pr.id                  
                            WHERE m.estatus = ? `,
                [data.estatus]  // Asumimos que un ADMIN puede consultar todos los agentes con el estatus dado
            );
            return result;
        }  

        // Acción para el rol "CLIENTE"  **Pendiente de definir   
        if (data.roluser === "CLIENTE") { 
            console.log(" CLiente: ", data.id_cliente)
            const [result] = await conexion.execute(
                ` SELECT m.id, c.id as Id_cliente, m.num_hit, nom_cliente, monto_entrada, fecha_entrada, valor_bcoin, precio_inicial, precio_final, m.monto_salida,
                    m.fecha_salida, m.utilidad_perdida, m.estatus, m.num_round, m.notas, c.id_agente
                    FROM  movimientos AS m
                        INNER JOIN  clientes AS c
                                ON  m.id_cliente = c.id 
                             WHERE  c.id = ? `,
                            [data.id_cliente]  // Los clientes solo pueden ver sus propios movimientos 

            );   
            return result;
        } 
     
        // Si el rol no es válido
        throw new Error("Rol no reconocido para realizar la consulta.");

    } catch (error) {
        console.error("Error en la consulta de movimientos:", error);
        throw error; // Lanza el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras la consulta.");
        }
    }
}


async function ResumenMovimientos (tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        console.log(" **  ResumenMovimientos:  ", data);  

        // Acción para el rol "AGENTE"
        if (data.roluser === "VENDEDOR") {
            const [result] = await conexion.execute(
                ` select  m.fh_venta, p.id as id_pago,  p.forma_pago,  
                        pr.nombre as nom_producto,   
                        count(m.id) as num_productos, sum(m.imp_total) as imp_total 
                        FROM  pventa_movimiento AS m
                        INNER JOIN users AS u 
                                ON  m.id_vendedor = u.id              
                        INNER JOIN tipo_pago AS p 
                                ON  m.id_pago = p.id               
                        INNER JOIN productos AS pr
                                ON  m.id_producto = pr.id    
                        where m.id > 0 
                        Group by m.fh_venta, p.id,  p.forma_pago, pr.nombre `
                       //,  [data.estatus, data.id_agente]
            );
            return result;
        }

        // Acción para el rol "ADMIN"
        if (data.roluser === "ADMIN") {
            const [result] = await conexion.execute(
                ` select  m.fh_venta, p.id as id_pago,  p.forma_pago,  
                        pr.nombre as nom_producto,   
                        count(m.id) as num_productos, sum(m.imp_total) as imp_total 
                        FROM  pventa_movimiento AS m
                        INNER JOIN users AS u 
                                ON  m.id_vendedor = u.id              
                        INNER JOIN tipo_pago AS p 
                                ON  m.id_pago = p.id               
                        INNER JOIN productos AS pr
                                ON  m.id_producto = pr.id    
                        where m.id > 0 
                        Group by m.fh_venta, p.id,  p.forma_pago, pr.nombre `
               // [data.estatus]  // Asumimos que un ADMIN puede consultar todos los agentes con el estatus dado
            );
                        
            return result;
        }

        // Acción para el rol "CLIENTE"  **Pendiente de definir   
      

        // Si el rol no es válido
        throw new Error("Rol no reconocido para realizar la consulta.");

    } catch (error) {
        console.error("Error en la consulta de movimientos:", error);
        throw error; // Lanza el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión
        if (conexion) {
             await conexion.close(); 
            console.log("Conexión liberada tras la consulta.");
        }
    }
}


async function clientesAutocomplete(query) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades como 'user_name' y 'user_password'
        console.log("query", query)
        let consultas = "";
        const termino = query.query;
        if (query.roluser === "ADMIN") {
            consultas = 'SELECT id, nom_cliente FROM clientes WHERE  nom_cliente LIKE ?';
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                consultas,
                [`%${termino}%`] // Pasar los parámetros como un array
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null
        }

        if (query.roluser === "AGENTE") {
            consultas = 'SELECT id, nom_cliente FROM clientes WHERE id_agente = ? and nom_cliente LIKE ?';
             // Ejecutar la consulta usando los parámetros en un array
             const [result] = await conexion.execute(
                consultas,
                [query.id_agente, `%${termino}%`] // Pasar los parámetros como un array
            );
             // Retornar el primer resultado (suponiendo que solo hay uno)
             return result || null; // Si no hay coincidencias, se devuelve null
        }
    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras clientesAutocomplete");
        }
    }
}


async function productoAutocomplete(tabla,query) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades como 'user_name' y 'user_password'
        console.log("--> query :", query)
        let consultas = "";
        const termino = query.query;
        
          //   consultas = 'SELECT id, nom_cliente FROM clientes WHERE  nom_cliente LIKE ?';
            
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                   `SELECT * FROM ${tabla} WHERE estatus = ? and nombre like ? `,
                     [query.estatus, `%${termino}%`] // Pasar los parámetros como un array
            );
            console.log (" resultado :",  result); 
            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null 


    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {            
             await conexion.close(); 
            console.log("Conexión liberada tras productoAutocomplete");
        }
    }
}



async function usuarioAutocomplete (tabla,query) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades como 'user_name' y 'user_password'
        console.log("--> query :", query)
        let consultas = "";
        const termino = query.query;
        
          //   consultas = 'SELECT id, nom_cliente FROM clientes WHERE  nom_cliente LIKE ?';
            
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                   `SELECT * FROM ${tabla} WHERE estatus = ? and user_name like ? `,
                     [query.estatus, `%${termino}%`] // Pasar los parámetros como un array
            );
            console.log (" resultado :",  result); 
            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null 

            
    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            await conexion.close(); 
            console.log("Conexión liberada tras usuarioAutocomplete");
        }
    }
}


async function vendedorAutocomplete(query) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades como 'user_name' y 'user_password'
        console.log("query", query)
        let consultas = "";
        const termino = query.query;
        //if (query.roluser === "ADMIN"  ) {
            consultas = 'SELECT id, user_name FROM users WHERE rol_user = "VENDEDOR"  AND  user_name LIKE ?';
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                consultas,
                [`%${termino}%`] // Pasar los parámetros como un array
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null
       // }

       /* 
        if (query.roluser === "AGENTE") {
            consultas = 'SELECT id, nom_cliente FROM clientes WHERE id_agente = ? and nom_cliente LIKE ?';
             // Ejecutar la consulta usando los parámetros en un array
             const [result] = await conexion.execute(
                consultas,
                [query.id_agente, `%${termino}%`] // Pasar los parámetros como un array
            );
             // Retornar el primer resultado (suponiendo que solo hay uno)
             return result || null; // Si no hay coincidencias, se devuelve null
        }
        */ 
    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras clientesAutocomplete");
        }
    }
}


async function todosAgente(tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        console.log(" --> Data todosAgentes ", data);   
        console.log(" --> Tabla: ", tabla); 

        
        // Si el rol del usuario es "ADMIN"
        if (data.roluser === "ADMIN") {
            const [result] = await conexion.execute(
                `SELECT * FROM ${tabla} WHERE id > 0 and estatus = ? and id_empresa = ? `,
                [data.estatus, data.id_empresa]  // Asegúrate de pasar 'data.estatus' como array
            );
           // console.log(" resultado ", result); 
            return result;
        }  

        // Si el rol del usuario es "AGENTE"
        if (data.roluser === "VENDEDOR") {
            const [result] = await conexion.execute(
                `SELECT * FROM ${tabla} WHERE estatus = ? `,
                [data.estatus]  // Pasar 'data.estatus' y 'data.id_agente' como array
            );
            return result;
        } 

        // Si el rol no es ni ADMIN ni AGENTE, podemos devolver un error o un resultado vacío
        throw new Error("Rol no válido para la consulta.");
    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error;  // Lanzamos el error para que lo maneje el bloque llamante
    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
            await conexion.close(); 
            console.log("Conexión liberada tras la consulta.");
        }
    }
}


async function todosConceptos(tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        console.log(" Data todosConceptos ", data); 

        // Si el rol del usuario es "ADMIN"
        if (data.roluser === "ADMIN") {
            const [result] = await conexion.execute(
                `SELECT * FROM ${tabla} WHERE estatus = ? AND tipo = ?`,
                [data.estatus, data.tipo]  // Asegúrate de pasar 'data.estatus' y 'data.tipo' como array
            );
            return result;
        }

        // Si el rol del usuario es "AGENTE"
        if (data.roluser === "VENDEDOR") {
            const [result] = await conexion.execute(
                `SELECT * FROM ${tabla} WHERE estatus = ? AND tipo = ?`,
                [data.estatus, data.tipo]  // Pasar 'data.estatus' y 'data.tipo' como array
            );
            return result;
        } 

        // Si el rol no es ni ADMIN ni AGENTE, podemos devolver un error o un resultado vacío
        throw new Error("Rol no válido para la consulta.");
    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error;  // Lanzamos el error para que lo maneje el bloque llamante
    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
            await conexion.close(); 
            console.log("Conexión liberada tras la consulta.");
        }
    }
}


async function todosAlmacenes( data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        console.log(" Data todosAlmacenes ", data); 

        // Si el rol del usuario es "ADMIN"
        
            const [result] = await conexion.execute(
                ` SELECT a.id, a.nombre, a.tel_almacen, a.direccion, a.id_usuario, a.estatus, u.user_name as user_name 
                        FROM almacenes a 
                        LEFT JOIN users u  
                               ON u.id = a.id_usuario 
                            Where a.estatus = ? `,
                [data.estatus]  // Asegúrate de pasar 'data.estatus' como array
            );
            return result;

        // Si el rol no es ni ADMIN ni AGENTE, podemos devolver un error o un resultado vacío
        //  throw new Error("Rol no válido para la consulta.");
    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error;  // Lanzamos el error para que lo maneje el bloque llamante
    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
             await conexion.close(); 
            console.log("Conexión liberada tras la consulta.");
        }
    }
}

async function todosMensajes ( data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        console.log(" Data todosMensajes ", data); 

        // Si el rol del usuario es "ADMIN"
        
            const [result] = await conexion.execute(
                ` SELECT  a.id as id_mensaje, a.id_empresa,  a.pushName, a.phone_number, a.mensaje, a.date_time, 
                            a.fh_registro, a.estatus, u.nombre as nom_empresa, a.folio_orden  
	                        FROM chat_orden a 
                            LEFT JOIN chat_empresa u  
                                ON u.id = a.id_empresa 
                            Where  a.id > 0  and u.estatus = 'A' and  a.id_empresa = ? 
                                   and a.estatus <>  ? `, 
                         [data.id_empresa, data.estatus]  // Asegúrate de pasar 'data.estatus' como array
                           // ,  [data.estatus]  // Asegúrate de pasar 'data.estatus' como array
            );
            return result;  

        // Si el rol no es ni ADMIN ni AGENTE, podemos devolver un error o un resultado vacío
        //  throw new Error("Rol no válido para la consulta.");
    } catch (error) {
        console.error("Error en la consulta todosMensajes:", error);
        throw error;  // Lanzamos el error para que lo maneje el bloque llamante
    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
             await conexion.close(); 
            console.log("Conexión liberada tras la consulta.");
        }
    }
}

async function todosAgenteProducto(tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        console.log(" Data todosAgentes ", data); 

        // Si el rol del usuario es "ADMIN"
        if (data.roluser === "ADMIN") {
            const [result] = await conexion.execute(
                `SELECT * FROM ${tabla} WHERE id_producto = ? and estatus = ?`,
                [data.id_producto, data.estatus]  // Asegúrate de pasar 'data.estatus' como array
            );
            return result;
        }

        // Si el rol del usuario es "AGENTE"
        if (data.roluser === "VENDEDOR") {
            const [result] = await conexion.execute(
                `SELECT * FROM ${tabla} WHERE id_producto = ? and estatus = ? AND id_agente = ?`,
                [data.id_producto, data.estatus]  // Pasar 'data.estatus' y 'data.id_agente' como array
            );
            return result;
        } 

        // Si el rol no es ni ADMIN ni AGENTE, podemos devolver un error o un resultado vacío
        throw new Error("Rol no válido para la consulta.");
    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error;  // Lanzamos el error para que lo maneje el bloque llamante
    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
             await conexion.close(); 
            console.log("Conexión liberada tras la consulta.");
        }
    }
}


async function todosDetalleCompra (tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        console.log(" Data todosAgentes ", data); 

        // Si el rol del usuario es "ADMIN"
        if (data.roluser === "ADMIN") {
            const [result] = await conexion.execute(
                `SELECT * FROM ${tabla} WHERE id > 0 and id_mov = ? `,
                [data.id_mov]  // Asegúrate de pasar 'data.estatus' como array
            );
            return result;
        }

        // Si el rol del usuario es "AGENTE"
        if (data.roluser === "VENDEDOR") {
            const [result] = await conexion.execute(
                  `SELECT * FROM ${tabla} WHERE id > 0 and id_mov = ? `,
                [data.id_mov]  // Asegúrate de pasar 'data.estatus' como array
            );
            return result;
        } 

        // Si el rol no es ni ADMIN ni AGENTE, podemos devolver un error o un resultado vacío
        throw new Error("Rol no válido para la consulta.");
    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error;  // Lanzamos el error para que lo maneje el bloque llamante
    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras la consulta.");
        }
    }
}


async function inventarioDetalle(tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        console.log(" Data inventarioDetalle ", data);  

        // Si el rol del usuario es "ADMIN"
        if (data.roluser === "ADMIN") {
            const [result] = await conexion.execute( 
                `select i.id as id_detalle,  i.id_inventario,  i.registro_lote, i.num_entrada, i.id_tipo_mov,  t.des_movimiento,  
                    i.estatus  
                    from inventario_det as i 
                    INNER join tipo_movimiento t 
                            ON i.id_tipo_mov  =  t.id 
                    where  i.id_inventario = ? and i.estatus = ?  `, 
                // `SELECT * FROM ${tabla} WHERE estatus = ?`,
                [data.id_inventario, data.estatus]  // Asegúrate de pasar 'data.estatus' como array
            );
            return result;
        }

        // Si el rol del usuario es "AGENTE"
        if (data.roluser === "VENDEDOR") {
            const [result] = await conexion.execute(               
                  `select i.id as id_detalle, i.id_inventario,  i.registro_lote, i.num_entrada, i.id_tipo_mov,  t.des_movimiento,  
                          i.estatus 
                    from inventario_det as i 
                    INNER join tipo_movimiento t 
                            ON i.id_tipo_mov  =  t.id 
                    where  i.id_inventario = ? and i.estatus = ?  `, 
                [data.id_inventario, data.id_agente]  // Pasar 'data.estatus' y 'data.id_agente' como array
            );
            return result;
        } 

        // Si el rol no es ni ADMIN ni AGENTE, podemos devolver un error o un resultado vacío
        throw new Error("Rol no válido para la consulta.");
    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error;  // Lanzamos el error para que lo maneje el bloque llamante
    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras la consulta.");
        }
    }
}


async function inventarioproducto(tabla, data) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        console.log(" Data inventarioProducto  ", data);  
        /* 
        // Si el rol del usuario es "ADMIN"
        if (data.roluser === "ADMIN") {
            const [result] = await conexion.execute( 
                `select i.id as id_detalle,  i.id_inventario,  i.registro_lote, i.num_entrada, i.id_tipo_mov,  t.des_movimiento,  
                    i.estatus  
                    from inventario_det as i 
                    INNER join tipo_movimiento t 
                            ON i.id_tipo_mov  =  t.id 
                    where  i.id_inventario = ? and i.estatus = ?  `, 
                // `SELECT * FROM ${tabla} WHERE estatus = ?`,
                [data.id_inventario, data.estatus]  // Asegúrate de pasar 'data.estatus' como array
            );
            return result;
        }
        */ 
            const [result] = await conexion.execute(               
                  ` select i.id, i.id_inventario, i.id_producto, p.nombre, i.estatus, i.cantidad_productos, 
                           i.id_estatus_prod, s.nombre as nom_estado_prod, i.registro_unico,  
                           i.id_estatus_origen_prod, o.nombre as nom_estatus_origen_prod,  
                           i.num_producto, i.costo_interno, i.costo_total, i.costo_transporte 
                      from inventario_producto i  
                     INNER join productos p 
                        ON p.id = i.id_producto 
                    INNER join cat_estatus_prod s 
                        ON s.id = i.id_estatus_prod  
                    INNER join cat_estatus_origen_prod o  
                        ON o.id = i.id_estatus_origen_prod                              
                     where  i.id_inventario = ?  and  i.estatus = ?  `, 
                [data.id_inventario, data.estatus]  // Pasar 'data.estatus' y 'data.id_agente' como array
            );
            return result;
              
     
        // Si el rol no es ni ADMIN ni AGENTE, podemos devolver un error o un resultado vacío
        throw new Error("Rol no válido para la consulta.");
    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error;  // Lanzamos el error para que lo maneje el bloque llamante
    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
             await conexion.close();  
            console.log("Conexión liberada tras la consulta.");
        }
    }
}


/*
function UsuariosAgente(tabla, data) {
    console.log("data", data)
    if (data.roluser === "ADMIN") {
        return new Promise((resolve, reject) => {
            conexion.query(`select u.*,  c.nom_cliente from users AS u
    LEFT JOIN  clientes as c
     on  u.id_cliente = c.id
    where U.ESTATUS = ?`, data.estatus,  (error, result) => {
                return error ? reject(error) : resolve(result);
            })
        })
    }

    if (data.roluser === "AGENTE") {
        return new Promise((resolve, reject) => {
            conexion.query(`select u.*,  c.nom_cliente from users AS u
    INNER JOIN  clientes as c
     on  u.id_cliente = c.id
    where c.id_agente = ? and U.ESTATUS = ?`, [data.id_agente, data.estatus], (error, result) => {
                return error ? reject(error) : resolve(result);
            })
        })
    }
}*/

async function UsuariosAgente(tabla, consulta) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades
        console.log("consulta.roluser", consulta.roluser)
        if (consulta.roluser === "ADMIN") {
            const parametros = [consulta.estatus];
            console.log("parametros", parametros)
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                `select u.*,  c.nom_cliente from users AS u
                LEFT JOIN  clientes as c
                on  u.id_cliente = c.id
                where U.ESTATUS = ?`,
                 parametros // Pasar los parámetros como un array
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null
        }
        if (consulta.roluser === "AGENTE") {
            const parametros = [consulta.id_agente, consulta.estatus];
            console.log("parametros", parametros)
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                `select u.*,  c.nom_cliente from users AS u
                INNER JOIN  clientes as c
                on  u.id_cliente = c.id
                where c.id_agente = ? and u.ESTATUS = ?`,
                parametros // Pasar los parámetros como un array
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null

        }

    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras UsuariosAgente");
        }
    }
}


/*
function validaUsuario(tabla, data) {
    console.log("data", data)
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT user_name,email, phone_number  FROM ${tabla} where user_name= ? or email = ? or phone_number = ?`, [data.user_name, data.email, data.phone_number], (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}*/

async function validaUsuario(tabla, consulta) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades como 'user_name' y 'user_password'
        console.log("consulta", consulta)

        const parametros = [consulta.user_name, consulta.email, consulta.phone_number];
        console.log("parametros", parametros)
        // Ejecutar la consulta usando los parámetros en un array
        const [result] = await conexion.execute(
            `SELECT user_name,email, phone_number  FROM ${tabla} where user_name= ? or email = ? or phone_number = ?`,
            parametros // Pasar los parámetros como un array
        );

        // Retornar el primer resultado (suponiendo que solo hay uno)
        return result || null; // Si no hay coincidencias, se devuelve null

    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras validaUsuario");
        }
    }
}

async function validaTerminal(tabla, consulta) {    
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades como 'user_name' y 'user_password'
        console.log("consulta", consulta)
        console.log(" Tabla validaTerminal ", tabla);  

        const parametros = [consulta.num_serie_hd , consulta.direc_mac, consulta.id_so ];
        console.log("parametros", parametros)
        // Ejecutar la consulta usando los parámetros en un array
        const [result] = await conexion.execute(
            `SELECT id, num_serie_hd, direc_mac, id_so, id_cliente FROM ${tabla} where num_serie_hd= ? or direc_mac = ? or id_so = ? `,
            parametros // Pasar los parámetros como un array  
        );  
   
        // Retornar el primer resultado (suponiendo que solo hay uno) 
        console.log(" Resultado validaTerminal ", result[0]);   

        return result[0] || null; // Si no hay coincidencias, se devuelve null
 
    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras validaTerminal");
        }
    }
}
 
async function validauso(tabla, consulta) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades como 'user_name' y 'user_password'
        console.log(" datos: ", consulta)
        console.log(" Tabla validauso: ", tabla);  

        const parametros = [consulta.id];
        console.log("parametros", parametros)
        // Ejecutar la consulta usando los parámetros en un array
        const [result] = await conexion.execute(
            `SELECT * FROM ${tabla} where id_terminal = ?  `,
            parametros // Pasar los parámetros como un array  
        );  
   
        // Retornar el primer resultado (suponiendo que solo hay uno) 
        console.log(" Resultado validauso ", result);  
        const existe = result?.length > 0; 

        if (existe) {
            // Si ya existe un registro, actualizamos el registro existente 
            /* 
            await conexion.execute(
                `UPDATE ${tabla} SET id_terminal = ? WHERE id_terminal = ?`,
                [consulta.id_terminal, consulta.id_terminal]
            );     
            */  
            let fechaRegistro = new Date(result[0].fh_registro); 
            let fechaActual = new Date(); 
            let diffTime = Math.abs(fechaActual - fechaRegistro); 
            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));  
            console.log(" Dias de uso ", diffDays); 

            let returnMensaje = ''; 

            console.log(" Fecha registro ", result[0].fh_registro);  
            console.log(" estatus  ", result[0].estatus);
            console.log(" Dias transcurridos ", diffDays);
          

             let datareturn = {};
        
            if (diffDays > 8 && result[0].estatus === 'demo') {
                // Actualizar el estatus si ha pasado más de 7 días { 

                returnMensaje = `El período de prueba de su cuenta ha finalizado. Si desea seguir utilizando nuestra solución, lo invitamos a contratar alguno de nuestros planes. Para más información, contáctenos al correo ventas@rubai.com.mx o visite nuestro sitio: rubai.com.mx para mas información`; 
                    let datareturn = { 
                        estatus: 'inactivo',  
                        mensaje: returnMensaje
                     };  

                     agregar('coi_bitacora', { 
                        id: 0, 
                        id_terminal: consulta.id,
                        fh_registro: new Date(),                         
                        desc_evento: returnMensaje,                   
                        desc_error: 'fin_demo',
                     });

                return datareturn;  
             } 

             if (result[0].estatus === 'inactivo' ) { 
                // Actualizar el estatus si es diferente
                    returnMensaje = `El estatus de su cuenta está Inactiva, por favor ponganse en contacto mediante la cuenta de email;  activacion@rubai.com.mx, en breve nos pondremos en contacto con usted.  `; 
                    
                    datareturn = {
                        estatus: 'inactivo',  
                        mensaje: returnMensaje
                    };    

                         agregar('coi_bitacora', { 
                        id: 0, 
                        id_terminal: consulta.id,
                        fh_registro: new Date(),                         
                        desc_evento: returnMensaje,  
                        desc_error: result[0].estatus,
                     });

                    return datareturn; 
                }  

                console.log(" --> Evento recibido antes de actualizar  ", consulta.evento);  
                console.log(" --> Plan : ", result[0].plan ); 
                let fecha = new Date();
                let contador = 0;  
                if (consulta.evento === 'reporte') { 
                    contador = 1;      
                        await conexion.execute( 
                                `update  ${tabla} set fh_ultimo_ingreso = ? ,  num_ejecucion = num_ejecucion + ? where id_terminal  =  ?  `,
                                [fecha, contador, consulta.id]
                            ); 

                }

             // veficamos el tipo de plan que tiene y contabilizamos uso     
             if (result[0].estatus === 'activo' ) { 
                  
                    if (result[0].plan === 'basico') {  

                        if (diffDays < 30 )   {  
                            if (result[0].num_ejecucion > 8 ) {  
                                returnMensaje = `Ha alcanzado el límite de generación de reportes de su plan para este mes. Si desea mejorar su plan, puede contactarnos al correo: activacion@rubai.com.mx, con gusto le atenderemos.`;                                                    
                                datareturn = { 
                                    estatus: 'inactivo',  
                                    mensaje: returnMensaje     
                                };

                                    agregar('coi_bitacora', { 
                                            id: 0, 
                                            id_terminal: consulta.id,
                                            fh_registro: new Date(),                         
                                            desc_evento: returnMensaje,                   
                                            desc_error: 'basico',
                                        });
                                
                                  // Pasaron los 30  dias del plan basico,  reseteamos los valores.  

                                await conexion.execute( 
                                    `update  ${tabla} set fh_registro = ? ,  num_ejecucion = ?, estatus = 'inactivo', renovacion = 'pendiente pago'  where id_terminal  =  ?  `,
                                    [fecha, contador, consulta.id]
                                ); 
                                console.log(" Se actualiza --> " , tabla); 

                                return datareturn;                                 

                        } 
                        } else { 
                            // Pasaron los 30  dias del plan basico,  reseteamos los valores.  
                                await conexion.execute( 
                                    `update  ${tabla} set fh_registro = ? ,  num_ejecucion = ?, renovacion = 'automatica'  where id_terminal  =  ?  `,
                                    [fecha, contador, consulta.id]
                                ); 
                                // Insertamos el primer uso del nuevo periodo.  
                                await conexion.execute( 
                                    `insert into  coi_renovacion (id_cliente,plan,fh_renovacion) values  (?,?,?)`,
                                    [result[0].id, result[0].plan, fecha]
                                ); 
                            }
                            
                    }

                    if (result[0].plan === 'profesional') {  
                            if ( diffDays < 30 )   { 

                                if (result[0].num_ejecucion > 20 ) {  
                                    returnMensaje = `Ha alcanzado el límite de generación de reportes de su plan para este mes. Si desea mejorar su plan, puede contactarnos al correo: activacion@rubai.com.mx, con gusto le atenderemos.`;                                                    
                                    datareturn = { 
                                        estatus: 'inactivo',  
                                        mensaje: returnMensaje
                                    }; 

                                    agregar('coi_bitacora', { 
                                        id: 0, 
                                        id_terminal: consulta.id,
                                        fh_registro: new Date(),                         
                                        desc_evento: returnMensaje,                   
                                        desc_error: result[0].plan,
                                        });

                                        
                                    await conexion.execute( 
                                        `update  ${tabla} set fh_registro = ? ,  num_ejecucion = ?, estatus = 'inactivo',  renovacion = 'pendiente pago'  where id_terminal  =  ?  `,
                                        [fecha, contador, consulta.id]
                                    ); 
                                    console.log(" Se actualiza --> " , tabla); 


                                    return datareturn; 
                                }
                        }  else {  
                            // Pasaron los 30  dias del plan medio,  reseteamos los valores.  
                                await conexion.execute( 
                                    `update  ${tabla} set fh_registro = ? ,  num_ejecucion = ? , renovacion = 'automatica'  where id_terminal  =  ?   `,
                                    [fecha, contador, consulta.id]
                                ); 
                                // Insertamos el primer uso del nuevo periodo.
                                await conexion.execute( 
                                    `insert into  coi_renovacion (id_cliente,plan,fh_renovacion) values  (?,?,?)`,
                                    [result[0].id, result[0].plan, fecha]
                                );  

                        }

                    }  
        
                 } // fin estatus activo 

                datareturn = {
                    estatus: 'activo',  
                    mensaje: 'Bienvenido de nuevo a la aplicación.  Su cuenta está activa.'
                 }; 

                 console.log(" Data de retorno validauso ", datareturn);  
                return datareturn;   


        } else {
            // Si no existe, insertamos un nuevo registro  
            /* 
                await conexion.execute(
                    `INSERT INTO ${tabla} (id_terminal) VALUES (?)`,
                    [consulta.id_terminal]
                );
            */ 
                console.log(" *  No existe registro de cliente *  "); 

                datareturn = {
                    estatus: 'sin_registro',  
                    mensaje: ' Complete su registro básico. Sin necesidad de métodos de pago ni cargos por ahora. Nuestro equipo se comunicará con usted para ofrecerle los planes y servicios ideales para sus necesidades \n\n\
                             Agradecemos su confianza.  '  
                            };  
                 return datareturn  || null;  
        }

      //  return datareturn  || null; // Si no hay coincidencias, se devuelve null
 
    } catch (error) {
        console.error("Error en el login:", error);

       agregar('coi_bitacora', { 
                        id: 0, 
                        id_terminal: consulta.id,
                        fh_registro: new Date(),                         
                        desc_evento: error.message,                               
                        desc_error: 'error en validauso', 
                        }); 


        throw error; // Lanzamos el error para que lo maneje el bloque llamante


    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras validauso");
        }
    }
}


/*
function login(tabla, consulta) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT id, user_password, user_name, rol_user, id_cliente  FROM ${tabla}  where ?`, consulta, (error, result) => {
            return error ? reject(error) : resolve(result[0]);
        })
    })
}*/
  
async function login(tabla, consulta) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades como 'user_name' y 'user_password'
        console.log("consulta en Login: ", consulta); 

        const parametros = [consulta.user_name];
        console.log("parametros", parametros)
        // Ejecutar la consulta usando los parámetros en un array
        const [result] = await conexion.execute(
            `SELECT id, user_password, user_name, rol_user, id_cliente, estatus, id_sucursal   
            FROM ${tabla} 
            WHERE user_name = ?`,
            parametros // Pasar los parámetros como un array
        );

        // Retornar el primer resultado (suponiendo que solo hay uno)
        return result[0] || null; // Si no hay coincidencias, se devuelve null

    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
             await conexion.close(); 
            console.log("Conexión liberada tras login");
        }
    }
}

async function hitMaximo (tabla, consulta) { 
    console.log( "HitMaximo", consulta.id_cliente);  
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb(); 

        console.log("consulta", consulta)

        const parametros = [consulta.id_cliente];
        console.log("parametros", parametros)
        // Ejecutar la consulta usando los parámetros en un array
        const [result] = await conexion.execute(
            `SELECT max(num_hit) as num_hit FROM ${tabla}  where id_cliente = ?`,
            parametros // Pasar los parámetros como un array
        );
 
          /* 
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT max(num_hit) as num_hit FROM ${tabla}  where `, [consulta], (error, result) => {
            return error ? reject(error) : resolve(result[0]);
        })
    })
    */
        // Retornar el primer resultado (suponiendo que solo hay uno)
        return result[0] || null; // Si no hay coincidencias, se devuelve null

    } catch (error) {
        console.error("Error en el hitMaximo: ", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras hitMaximo ");
        }
    }; 

}


async function rendimiento (tabla, consulta) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades como 'user_name' y 'user_password'
        console.log(" rendimiento:  --> ", consulta); 
          
        const parametros = [consulta.precio_final, consulta.id_cliente];
        console.log(" parametros ", parametros)
        // Ejecutar la consulta usando los parámetros en un array
        const [result] = await conexion.execute(
            `UPDATE ${tabla} SET precio_final = ?, utilidad_perdida = round((valor_bcoin * precio_final) - (valor_bcoin * precio_inicial),2) 
             where  id  > 0  AND  id_cliente = ? `,
            parametros // Pasar los parámetros como un array
        );

        // Retornar el primer resultado (suponiendo que solo hay uno)
        return result || null; // Si no hay coincidencias, se devuelve null

    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
           
            await conexion.close(); 
            console.log("Conexión liberada tras baja");
        }
    }
}
 
async function ProductosAutocomplete(query) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades como 'user_name' y 'user_password'
        console.log("query", query)
        let consultas = "";
        const termino = query.query;
        if (query.roluser === "ADMIN") {
            consultas = 'SELECT id, nombre as nom_cliente  FROM productos WHERE nombre LIKE ?';
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                consultas,
                [`%${termino}%`] // Pasar los parámetros como un array
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null
        }

        if (query.roluser === "VENDEDOR") {
            consultas = 'SELECT id, nombre as nom_cliente, precio_venta, stock_actual FROM productos WHERE nombre LIKE ?';
             // Ejecutar la consulta usando los parámetros en un array
             const [result] = await conexion.execute(
                consultas,
                [query.id_agente, `%${termino}%`] // Pasar los parámetros como un array
            );
             // Retornar el primer resultado (suponiendo que solo hay uno)
             return result || null; // Si no hay coincidencias, se devuelve null
        }
    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {         
            await conexion.close();  
            console.log("Conexión liberada tras ** ProductosAutocomplete");
        } 
    }
} 

async function PiezasAutocomplete(query) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades como 'user_name' y 'user_password'
        console.log("query", query)
        let consultas = "";
        const termino = query.query;
        if (query.roluser === "ADMIN") {
            consultas = ' select id, id_producto, id_imagen, nombre_pieza, num_piezas, precio, descripcion_pieza, estatus from inventario_pieza  WHERE nombre_pieza LIKE ?';
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                consultas,
                [`%${termino}%`] // Pasar los parámetros como un array
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null
        }

        if (query.roluser === "VENDEDOR") {            
                consultas = ' select id, id_producto, id_imagen, nombre_pieza, num_piezas, precio, descripcion_pieza, estatus from inventario_pieza  WHERE nombre_pieza LIKE ?';
             // Ejecutar la consulta usando los parámetros en un array
             const [result] = await conexion.execute(
                consultas,
                [query.id_agente, `%${termino}%`] // Pasar los parámetros como un array
            );
             // Retornar el primer resultado (suponiendo que solo hay uno)
             return result || null; // Si no hay coincidencias, se devuelve null
        }
    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras productos autocomplete");
        }
    }
}


async function InventarioAgente( consulta) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades
        console.log("consulta.roluser", consulta.roluser)
        if (consulta.roluser === "ADMIN") {
            const parametros = [consulta.id_estatus_prod];
            console.log("parametros", parametros)
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                `   Select t.num_lote, t.nombre_lote, t.fh_entrega,  i.num_producto, p.nombre, i.registro_unico,  i.costo_interno, i.costo_transporte, i.costo_total,  
                        eo.nombre as nom_estatus_origen,  ep.nombre as nom_estatus_producto, i.id_estatus_prod, t.stock_total,  t.precio_compra, t.fh_ingreso, i.id,  
                        i.precio_mayoreo,  i.precio_minimo, i.precio_ideal, i.precio_cliente   
                    from inventario_producto i, productos p, inventario t, cat_estatus_origen_prod eo, cat_estatus_prod ep    
                    Where i.id_producto =  p.id 
                    and t.id =  i.id_inventario 
                    and eo.id = i.id_estatus_origen_prod  
                    and ep.id = i.id_estatus_prod   
                    and ep.id = IFNULL(?, ep.id) `,  
                 parametros // Pasar los parámetros como un array 
                 // i.id, i.nombre_lote,  i.stock_total, i.fh_ingreso, i.precio_compra, i.fh_entrega,  i.precio_compra_lote, i.estatus,  i.costo_transporte, i.origen_lote  
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null
        }
        if (consulta.roluser === "VENDEDOR") {
            const parametros = [consulta.id_agente, consulta.estatus];
            console.log("parametros", parametros)
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                ` SELECT i.id, i.nombre_lote,  i.stock_total, i.fh_ingreso, i.precio_compra,
                 i.precio_compra_lote, u.nombre as Sucursal, i.estatus, u.id as IdSucursal, i.costo_transporte, i.origen_lote   
                    FROM inventario as i
                INNER JOIN  productos as p
                    on i.id_producto = p.id
                INNER JOIN  almacenes AS u
                    ON  i.id_ubicacion = u.id
                WHERE i.estatus = ?`,
                parametros // Pasar los parámetros como un array
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null

        }

    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras UsuariosAgente");
        }
    }
}



async function clientesActivos(TABLA, consulta) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades 
        console.log(" --> consulta ", consulta)
        console.log(" --> consulta.roluser", consulta.roluser)
        if (consulta.roluser === "ADMIN") {
            const parametros = [consulta.estatus];
            console.log("parametros", parametros)
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute( 
                `   select email_cliente, pushName, phone_number,  id_empresa, 
                           fh_alta, campana_diario, campana_semana, campana_mensual, 
                           envia_campana, fh_actualiza_campana  
                        from chat_cliente  
                        where id > 0  
                          and estatus  = ?  
                          and id_empresa =  1  `,  
                 parametros // Pasar los parámetros como un array 
                 //   and ep.id = IFNULL(?, ep.id) `,    
                 // i.id, i.nombre_lote,  i.stock_total, i.fh_ingreso, i.precio_compra, i.fh_entrega,  i.precio_compra_lote, i.estatus,  i.costo_transporte, i.origen_lote  
            );

            // Retornar el primer resultado (suponiendo que solo hay uno) 
            // console.log(" --> resultado ", result);  

            return result || null; // Si no hay coincidencias, se devuelve null
        }
        if (consulta.roluser === "VENDEDOR") {
            const parametros = [consulta.id_agente, consulta.estatus];
            console.log("parametros", parametros)
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                ` SELECT i.id, i.nombre_lote,  i.stock_total, i.fh_ingreso, i.precio_compra,
                 i.precio_compra_lote, u.nombre as Sucursal, i.estatus, u.id as IdSucursal, i.costo_transporte, i.origen_lote   
                    FROM inventario as i
                INNER JOIN  productos as p
                    on i.id_producto = p.id
                INNER JOIN  almacenes AS u
                    ON  i.id_ubicacion = u.id
                WHERE i.estatus = ?`,
                parametros // Pasar los parámetros como un array
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null

        }

    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras UsuariosAgente");
        }
    }
}



async function inventarioLote ( consulta) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades
        console.log("consulta.roluser", consulta.roluser)
        if (consulta.roluser === "ADMIN") {
            const parametros = [consulta.estatus];  
            console.log("parametros", parametros)
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                `  SELECT * FROM inventario  
                   where estatus = ? `,  
                 parametros // Pasar los parámetros como un array 
                 // i.id, i.nombre_lote,  i.stock_total, i.fh_ingreso, i.precio_compra, i.fh_entrega,  i.precio_compra_lote, i.estatus,  i.costo_transporte, i.origen_lote  
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null
        }
        if (consulta.roluser === "VENDEDOR") {
            const parametros = [consulta.id_agente, consulta.estatus];
            console.log("parametros", parametros)
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                ` SELECT * FROM inventario  `,
                parametros // Pasar los parámetros como un array
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null

        }

    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {
            
             await conexion.close(); 
            console.log("Conexión liberada tras UsuariosAgente");
        }
    }
}

async function inventarioPiezas(tabla, consulta) {
    let conexion;
    try {
        // Obtener la conexión desde el pool
        conexion = await conexiondb();

        // Asegurarse de que consulta es un objeto con propiedades
        console.log("consulta.roluser", consulta.roluser)
        if (consulta.roluser === "ADMIN") {
            const parametros = [consulta.id_producto, consulta.estatus];
            console.log("parametros", parametros)
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                ` select  id as id_pieza,  id_producto, id_imagen, nombre_pieza, num_piezas, precio, descripcion_pieza, estatus
                    from inventario_pieza
                    where  id_producto = ? and estatus = ?  `, 
                 parametros // Pasar los parámetros como un array
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null
        }
        if (consulta.roluser === "VENDEDOR") {            
            const parametros = [consulta.id_producto, consulta.estatus];
            console.log("parametros", parametros)
            // Ejecutar la consulta usando los parámetros en un array
            const [result] = await conexion.execute(
                 ` select id as id_pieza, id_producto, id_imagen, nombre_pieza, num_piezas, precio, descripcion_pieza, estatus
                     from inventario_pieza 
                    where id_producto = ? and i.estatus = ?  `, 
                parametros // Pasar los parámetros como un array
            );

            // Retornar el primer resultado (suponiendo que solo hay uno)
            return result || null; // Si no hay coincidencias, se devuelve null

        } 
 
    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanzamos el error para que lo maneje el bloque llamante

    } finally {
        // Liberar la conexión si se obtuvo
        if (conexion) {            
             await conexion.close(); 
            console.log("Conexión liberada tras UsuariosAgente");
        }
    }
}



module.exports = {
    todos,
    uno,
    unoValorEmpresa, 
    unoCampanaEvento, 
    agregar, 
    actualizar, 
    agregarArray,  
    baja,
    eliminar, 
    query,
    Movimientos, 
    movimientosChat, 
    MovimientosPorPeriodo, 
    ResumenMovimientos,  
    clientesAutocomplete,
    productoAutocomplete, 
    todosAgente,
    todosMensajes,  
    todosConceptos, 
    todosDetalleCompra,  
    UsuariosAgente,
    validaUsuario,
    validaTerminal,  
    validauso, 
    login, 
    hitMaximo, 
    rendimiento, 
    vendedorAutocomplete,   
    ProductosAutocomplete, 
    usuarioAutocomplete,  
    PiezasAutocomplete, 
    InventarioAgente, 
    inventarioLote,   
    inventarioDetalle, 
    inventarioPiezas, 
    inventarioproducto, 
    todosAgenteProducto, 
    todosAlmacenes, 
    actualizaProrrateo, 
    obtieneValorCatalogo, 
    generaFolio,  
    clientesActivos,  
    entregaClienteschat,  
    clientesChat
     
}