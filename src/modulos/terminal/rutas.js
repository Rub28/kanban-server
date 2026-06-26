const express = require('express')
const seguridad = require('./seguridad.js')
const respuestas = require('../../Respuestas/respuestas.js')
const controlador = require('./index');

const router = express.Router();

// router.post('/validaUsuario',seguridad(),validaUsuario);
router.post('/validaTerminal',validaTerminal);
router.get('/autocomplete', vendedorAutocomplete );
router.get('/autocompleteUsuario', usuarioAutocomplete );
router.get('/', seguridad(),todos);
router.get('/:id', uno);
router.post('/', agregar);  //  solo para los usuarios iniciales.  
//router.post('/', seguridad(), agregar);
router.put('/',seguridad(), baja);

async function todos(req,res, next){
   try {
      const items = await controlador.todos(req.query)
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

async function agregar (req,res, next){
   try {

      req.body.fh_registro = new Date(); 
      
      const items = await controlador.agregar(req.body)   
      // console.log(" items agregados ", items);  
      if(req.body.id == 0){
         mensaje = 'Registro agregado correctamente';
      } else{
         mensaje = 'Registro actualizado correctamente';
      }
         respuestas.success(req, res, items.insertId,  200)
   } catch (error) {
         next(error)
   }
}

async function baja (req,res, next){
   console.log("req.body", req.body)
   try {
      const items = await controlador.baja(req.body)
         respuestas.success(req, res, 'Registro dado baja correctamente', 200)
   } catch (error) {
         next(error)
   }
}

async function validaTerminal (req,res, next){
   try {
      const items = await controlador.validaTerminal(req.body)
         respuestas.success(req, res, items, 200)
   } catch (error) {
      next(error)
   }
}

async function vendedorAutocomplete (req,res, next){
   try {
      console.log("req.params.query", req.query.query)
      console.log("req.params.id_agente", req.query.id_agente)
      console.log("req.params.roluser", req.query.roluser)
      const items = await controlador.vendedorAutocomplete(req.query)
      respuestas.success(req, res, items, 200)
   } catch (error) {
      next(error)
   }  
}


async function usuarioAutocomplete (req,res, next){
   try {
      console.log("req.params.query", req.query.query)
      console.log("req.params.id_agente", req.query.id_agente)
      console.log("req.params.roluser", req.query.roluser)
      const items = await controlador.usuarioAutocomplete(req.query)
      respuestas.success(req, res, items, 200)
   } catch (error) {
      next(error)
   }  
}

module.exports = router;