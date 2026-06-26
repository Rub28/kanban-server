const path = require('path');
const fs = require('fs');
const express = require('express')
const respuestas = require('../../Respuestas/respuestas')
const controlador = require('./index');

const upload = require('../../middleware/upload');

const router = express.Router();
router.put('/bajaImagen', bajaImagen);
router.get('/autocomplete', ClientesAutocomplete);
router.get('/productoAutocomplete', productoAutocomplete);
router.post('/llenadoCombo', llenadocombo); 
router.post('/todosagente', todosAgente);
router.get('/', todos);
router.get('/:id', uno);
router.post('/', agregar);
router.put('/', baja);


router.post('/todosImagen', todosImagen);

async function todos(req,res, next){
   try {
      console.log("entra aca")
      const items = await controlador.todos()
      respuestas.success(req, res, items, 200)
   } catch (error) {
      next(error)
   }  
}

async function llenadocombo(req,res, next){ 

   console.log(" -- llenadoCombo req.body", req.body)
   try {
      const items = await controlador.llenadocombo(req.body)
         respuestas.success(req, res, items, 200)
   } catch (error) {
         next(error)
   }
}

async function uno (req,res, next){
   try {
      const items = await controlador.uno(req.params.id)
         respuestas.success(req, res, items, 200)
   } catch (error) {
      next(error)
   }
}

// Subir producto con imagen
//router.post('/', upload.single('imagen'), agregar);

async function agregar (req,res, next){
   try {
      const items = await controlador.agregar(req.body)
      if(req.body.id_cliente == 0){
         mensaje = 'Registro agregado correctamente';
      } else{
         mensaje = 'Registro actualizado correctamente';
      }
         respuestas.success(req, res, mensaje, 201)
   } catch (error) {
         next(error)
   }
}

async function baja (req,res, next){
   try {
      const items = await controlador.baja(req.body)
         respuestas.success(req, res, 'Registro dado baja correctamente', 200)
   } catch (error) {
         next(error)
   }
}

async function ClientesAutocomplete(req,res, next){
   try {
      console.log("req.params.query", req.query.query)
      console.log("req.params.id_agente", req.query.id_agente)
      console.log("req.params.roluser", req.query.roluser)
      const items = await controlador.ClientesAutocomplete(req.query)
      respuestas.success(req, res, items, 200)
   } catch (error) {
      next(error)
   }  
}

async function productoAutocomplete(req,res, next){
   try {
      console.log("req.params.query", req.query.query)
      console.log("req.params.id_agente", req.query.id_agente)
      console.log("req.params.roluser", req.query.roluser)
      const items = await controlador.productoAutocomplete (req.query)
      respuestas.success(req, res, items, 200)
   } catch (error) {
      next(error)
   }  
}

async function todosAgente (req,res, next){
   console.log("req.body", req.body)
   try {
      const items = await controlador.todosAgente(req.body)
         respuestas.success(req, res, items, 200)
   } catch (error) {
         next(error)
   }
}

async function todosImagen (req,res, next){
   console.log("req.body", req.body)
   try {
      const items = await controlador.todosAgenteImg(req.body)
         respuestas.success(req, res, items, 200)
   } catch (error) {
         next(error)
   }
}

async function bajaImagen (req,res, next){
   try {
      console.log("req.params.query", req.query.query)
      console.log("req.params.id_agente", req.query.filename)
      const data  = {
         id: req.body.id,
         estatus: 'B'
      }

      const __dirname = 'uploads/';
      const filePath = path.join(__dirname, 'uploads', req.query.filename);
 
     fs.unlink(filePath, (fsErr) => {
       if (fsErr) {
         return res.status(500).json({ error: 'Error al eliminar el archivo' });
       }
 
       const items = controlador.bajaImg(data)
       respuestas.success(req, res, 'Registro dado baja correctamente', 200)
     });

      
      
   } catch (error) {
         next(error)
   }
}


 
router.post('/imagen', upload.single('imagen'), async (req, res, next) => {
   try {
     if (!req.file) {
       return respuestas.error(req, res, 'No se subió ninguna imagen', 400);
     }
 
     const ruta = req.file.filename;
     const data = {
       id: 0,
       id_producto: req.body.id_producto,
       img: ruta
     };
 
     console.log("data:", data);
 
     const resultado = await controlador.agregarImg(data);
 
     respuestas.success(req, res, {
       mensaje: 'Imagen subida y asociada correctamente',
       ruta: ruta,
       resultado: resultado
     }, 201);
   } catch (error) {
     console.error('Error al subir la imagen:', error);
     next(error); // Pasas el error al middleware de manejo de errores
   }
 });


 router.delete('/EliminarImagenes/:id/:filename', (req, res) => {
   const { id, filename } = req.params;
   console.log('Eliminando ID:', id);
   const uploadDir = 'uploads/';

  const filePath = path.join('', 'uploads', filename);
  console.log('filePath', filePath)

  fs.unlink(filePath, (fsErr) => {
    if (fsErr) return res.status(500).json({ error: 'Error al eliminar archivo' });
   
    const data = {
      id: id,
      estatus: 'B'
    }
    const items = controlador.bajaImg(data)
    res.json({ message: `Imagen ${id}  ${filename} eliminada correctamente` });      

    
  });
 });



module.exports = router;