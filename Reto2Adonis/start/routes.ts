import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group( () => {
  Route.get('/listar-animales','AnimalsController.getListarAnimales')
  Route.get('/filtrar-especie/:search', 'AnimalsController.getFiltrarEspecie')
  Route.get('/filtrar-menores-ocho', 'AnimalsController.getFiltrarMenoresOcho') //RUTA A METODO DEL REQUISITO
  Route.get('/filtrar-menores/:edad', 'AnimalsController.getFiltrarMenores') //NUEVO METODO PARA BUSCAR ANIMALES POR DEBAJO DE CUALQUIER EDAD


  Route.post('/registrar-animal', 'AnimalsController.postRegistrarAnimal')

  Route.put('/actualizar-animal/:codigo', 'AnimalsController.putActualizarAnimal')

  Route.delete('/borrar-animal/:codigo', 'AnimalsController.deleteBorrarAnimal')
}).prefix('/petShop')