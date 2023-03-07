import Route from '@ioc:Adonis/Core/Route'

Route.group(() =>{

  Route.post('/register', 'UsersController.registerUser')
  Route.post('/login', 'UsersController.login')
  
  Route.group(() => {
    Route.put('/update/:id','UsersController.updateUser')
    Route.delete('/delete/:id','UsersController.deleteUser').middleware('admin')
    Route.get('/list', 'UsersController.listUsers')
    Route.get('/list-user/:id', 'UsersController.listUser')
  }).prefix('/user').middleware('auth').middleware('employee')

  Route.group(() => {
    Route.post('/register', 'ProfilesController.registerProfile').middleware('admin')
    Route.put('/update/:id', 'ProfilesController.updateProfile').middleware('admin')
    Route.delete('/delete/:id', 'ProfilesController.deleteProfile').middleware('admin')
    Route.get('/list', 'ProfilesController.listProfiles')
    Route.get('/list-profile/:id', 'ProfilesController.listProfile')
  }).prefix('/profile').middleware('auth').middleware('employee')

  Route.group(() => {
    Route.post('/register', 'BooksController.registerBook').middleware('employee')
    Route.put('/update/:id', 'BooksController.updateBook').middleware('employee')
    Route.delete('/delete/:id', 'BooksController.deleteBook').middleware('employee')
    Route.get('/list', 'BooksController.listBooks').middleware('customer')
    Route.get('/list-book/:id', 'BooksController.listBook').middleware('customer')
  }).prefix('/book').middleware('auth')

}).prefix('/api')




