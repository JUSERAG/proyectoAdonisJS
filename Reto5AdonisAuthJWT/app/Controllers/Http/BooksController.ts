import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from 'App/Models/Book'
import User from 'App/Models/User'

export default class BooksController {
    public async registerBook({request}: HttpContextContract) {
        const {title, id_user} = request.all()
        try {
            const existUser = await User.find(id_user)
            if (existUser){
                const newBook = new Book()
                newBook.title = title
                newBook.id_user = id_user
                if(await newBook.save()){
                    return {
                        'msg': 'Libro registrado con exito',
                        'status': 200
                    }
                }
                return {
                    'msg': 'No se pudo guardar el nuevo libro',
                    'status': 501
                }
            }
            return {
                'msg': 'No se ha creado un usuario asociado',
                'status': 400
            }
            
        } catch (error) {
            return {
                'msg': 'Error en el servidor',
                'status': 500
            }
        }

    }

    public async updateBook({request}: HttpContextContract) {
        const id_book = request.param('id')
        try {
            const book = await Book.find(id_book)
            if (book) {
                const {title, id_user} = request.all()
                const existUser = await User.find(id_user)
                if (existUser) {
                    book.title = title
                    book.id_user = id_user
                    if(await book.save()) {
                        return {
                            'msg': 'Se actualizó el libro con exito',
                            'status': 200
                        }
                    }
                    return {
                        'msg': 'No fue posible actualizar el libro',
                        'status': 501
                    }
                }
                return {
                    'msg': 'No existe usuario asociado',
                    'status': 402
                }
            }
            return {
                'msg': 'No existe el libro',
                'status': 401
            }
        } catch (error) {
            return {
                'msg': 'Error en el servidor',
                'status': 500
            }
        }
    }

    public async deleteBook ({request}: HttpContextContract) {
        const id_book = request.param('id')
        try {
            const existBook = await Book.find(id_book)
            if(!existBook){
                return {
                    'msg': 'NO existe libro con ese codigo',
                    'status': 400
                }
            }
            if (! await Book.query().where('id_book', id_book).delete()){
                return {
                    'msg': 'No se pudo eliminar el libro',
                    'status': 501
                }
            }
            return {
                'msg': 'Se eliminó el libro con exito',
                'status': 200
            }
        } catch (error) {
            return {
                'msg': 'Error en el servidor',
                'status': 500
            }
        }
    }

    public async listBooks(): Promise<Book[]> {
        return await Book.all()
    }

    public async listBook({request}:HttpContextContract){
        return await Book.find(request.param('id'))
    }
}