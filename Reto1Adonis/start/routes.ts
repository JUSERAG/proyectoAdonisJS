import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  //RUTAS DE CONSULTA CONTROLADOR USUARIO
  Route.get('/listar-usuarios','UsuariosController.getListarUsuarios') 
  Route.get('/listar-perfil','UsuariosController.getListarUsuariosYPerfil')
  Route.get('/listar-publicacion','UsuariosController.getListarUsuariosYPublicaciones')
  Route.get('/listar-usuarios-grupos','UsuariosController.getListarUsuariosGrupos')
  Route.get('/listar-usuario/:id', 'UsuariosController.getBuscarId')
  Route.get('/filtrar-usuario/:search','UsuariosController.filtroPorNombre')

  //RESTO DE RUTAS DE CONSULTA
  Route.get('/listar-perfiles', 'PerfilsController.getListarPerfiles')
  Route.get('/listar-publicaciones', 'PublicacionesController.getListarPublicaciones')
  Route.get('/listar-grupos', 'GruposController.getListarGrupos')

  //REGISTRO DE TABLAS
  Route.post('/registro-usuarios','UsuariosController.setRegistrarUsuarios')
  Route.post('/registro-perfil','PerfilsController.setRegistrarPerfil')
  Route.post('/registro-publicacion', 'PublicacionesController.setRegistroPublicacion')
  Route.post('/registro-grupo', 'GruposController.setRegistrarGrupo')
  Route.post('/registro-usuario-grupo', 'UsuarioGrupoController.setRegistrarUsuarioGrupo')

  //ACTUALIZACIÓN DE REGISTROS
  Route.put('/actualizar-usuario/:id','UsuariosController.putActualizarUsuario')
  Route.put('/actualizar-perfil/:id', 'PerfilsController.putActualizarPerfil')
  Route.put('/actualizar-publicacion/:id', 'PublicacionesController.putActualizarPublicacion')
  Route.put('/actualizar-grupo/:id', 'GruposController.putActualizarGrupo')
  Route.put('/actualizar-usuario-grupo/:id', 'UsuarioGrupoController.putActualizarGrupoUsuario')

  //ELIMINACIÓN DE REGISTROS
  Route.delete('/borrar-usuario/:id', 'UsuariosController.deleteBorrarUsuario')
  Route.delete('/borrar-perfil/:id', 'PerfilsController.deleteBorrarPerfil')
  Route.delete('/borrar-publicacion/:id', 'PublicacionesController.deleteBorrarPublicacion')
  Route.delete('/borrar-grupo/:id', 'GruposController.deleteBorrarGrupo')

}).prefix('/alcaldia')
