const https = require('https');
const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const administracion = require('./modulos/administracion/rutas');
const movimientosChat = require('./modulos/reportes/rutas');  
const clientesActivos = require('./modulos/reportes/rutas');
const eventocampana = require('./modulos/eventocampana/rutas');
const campanas = require('./modulos/campanas/rutas');  
const eventos = require('./modulos/eventos/rutas');  
const mensajeria = require('./modulos/mensajeria/rutas'); 
const ordenes = require('./modulos/ordenes/rutas');  
const clientes = require('./modulos/clientes/rutas');
const usuarios = require('./modulos/Usuarios/rutas');
const movimientos = require('./modulos/Movimientos/rutas');
const movimientosDet = require('./modulos/MovimientosDet/rutas');
const auth = require('./modulos/auth/rutas');
const productos = require('./modulos/Productos/rutas');
const inventario = require('./modulos/Inventario/rutas'); 
const almacen = require('./modulos/Almacen/rutas');
const catProducto = require('./modulos/CatProducto/rutas'); 
const catalogos = require('./modulos/CatMarcas/rutas');
const error = require('./Respuestas/errors');
const InventarioDet = require('./modulos/InventarioDet/rutas');
const InventarioPieza = require('./modulos/InventarioPiezas/rutas'); 
const InventarioProducto = require('./modulos/InventarioProducto/rutas'); 
const CatTasasBanco = require('./modulos/CatTasasBanco/rutas');
const terminal = require('./modulos/terminal/rutas');   
const bitacora = require('./modulos/bitacora/rutas');


const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads')); // Servir archivos
// configuracion 
app.set('port', config.app.port);

// rutas 
app.use(cors());  
app.use('/api/administracion', administracion)
app.use('/api/reportes', clientesActivos)
app.use('/api/campanas', campanas) 
app.use('/api/eventocampana', eventocampana)
app.use('/api/eventos', eventos)  
app.use('/api/mensajeria', mensajeria) 
app.use('/api/ordenes', ordenes) 
app.use('/api/almacen', almacen)
app.use('/api/CatProducto', catProducto)
app.use('/api/CatMarcas', catalogos)
app.use('/api/Inventario', inventario)
app.use('/api/Inventario/inventarioLote', inventario)
app.use('/api/InventarioDet', InventarioDet) 
app.use('/api/InventarioPiezas', InventarioPieza) 
app.use('/api/InventarioProductos', InventarioProducto)   
app.use('/api/productos', productos)
app.use('/api/CatTasasBanco', CatTasasBanco)
app.use('/api/productos/llenadoCombo', productos)
app.use('/api/productos/productoAutocomplete', productos)
app.use('/api/clientes', clientes)
app.use('/api/clientes/autocomplete', clientes)
app.use('/api/clientes/todosagente', clientes)
app.use('/api/clientes/validaCliente', clientes)  
app.use('/api/usuarios', usuarios)
app.use('/api/usuarios/validaUsuario', usuarios) 
app.use('/api/usuarios/clientesChat', usuarios)
app.use('/api/movimientos', movimientos) 
app.use('/api/reportes', movimientosChat)
app.use('/api/movimientosDet', movimientosDet)
app.use('/api/movimientos/todosMovimientos', movimientos)
app.use('/api/auth', auth)
app.use('/api/terminal', terminal ); 
app.use('/api/terminal/validaTerminal', terminal ); 
app.use('/api/bitacora', bitacora ); 

app.use(error);  

   
// Cargar los certificados de Let's Encrypt
// solo para produccion. 
/* 
const options = {
    key: fs.readFileSync(path.join('/etc/letsencrypt/live/srv743626.hstgr.cloud/privkey.pem')),
    cert: fs.readFileSync(path.join('/etc/letsencrypt/live/srv743626.hstgr.cloud/fullchain.pem')),
  };
  

  // Crear el servidor HTTPS
  https.createServer(options, app).listen(443,'0.0.0.0', () => {
    console.log('Servidor HTTPS escuchando en el puerto 443 ');
  });  
  
 */

module.exports =app;
