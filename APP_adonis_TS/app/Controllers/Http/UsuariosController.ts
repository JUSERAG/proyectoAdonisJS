import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from 'App/Models/Usuario'

export default class UsuariosController {

    //METODO REGISTRO USUARIOS
    public async setRegistrarUsuarios({request,response}: HttpContextContract) {
        const dataUsuario = request.only([
            'codigo_usuario', 'nombre_usuario', 'contrasena', 'email', 'telefono'
        ])

        try {
            const codigoUsuario = dataUsuario.codigo_usuario
            console.log(codigoUsuario)
            const usuarioExistente: Number = await this.getValidarUsuarioExistente(codigoUsuario)
            if (usuarioExistente === 0){
                await Usuario.create(dataUsuario)
                response.status(200).json({'msg': 'El usuario fue registrado con exito'})
            }else{
                response.status(400).json({'msg':'Error, codigo de usuario ya fue registrado'})
            }
        } catch (error) {
            console.log(error)
            response.status(500).json({'msg': 'Error en el servidor !!'})
        }
    }

    //FUNCIÓN VALIDACIÓN DE EXISTENCIA DE USUARIO
    private async getValidarUsuarioExistente(codigo_usuario: Number): Promise<Number> {
        const total = await Usuario.query().where({'codigo_usuario':codigo_usuario}).count('*').from('usuarios')
        return parseInt(total[0]['count(*)'])
    }

    //METODO PARA MOSTRAR TODOS LOS USUARIOS
    public async getListarUsuarios(): Promise<Usuario[]> {
        const user = await Usuario.all()
        return user;
    }

    //METODO ACTUALIZAR DATOS DE UN USUARIO
    public async putActualizarUsuario({ request }: HttpContextContract){
        const id = request.param('id')
        const usuario = await Usuario.findOrFail(id)
        const datos = request.all()

        usuario.nombre_usuario = datos.nombre_usuario
        usuario.contrasena = datos.contrasena
        usuario.email = datos.email
        usuario.telefono = datos.telefono

        await usuario.save()
        return {'mensaje':'Actualizado correctamente','estado':200}
        
    }

    //METODO BORRAR DATOS DE UN USUARIO
    public async deleteBorrarUsuario({request}: HttpContextContract) {
        const id = request.param('id')
        await Usuario.query().where('codigo_usuario',id).delete()
        return {'mensaje':'Elimino correctamente','estado':200}
    }

    //MOSTRAR UN USUARIO
    public async getBuscarId({request}: HttpContextContract) {
        const codigoUsuario = request.param('id')
        const user = await Usuario.find(codigoUsuario)
        return user
    }

    //MOSTRAR TODOS LOS USUARIOS CON PERFIL
    public async getListarUsuariosYPerfil(): Promise<Usuario[]> {
        const user = await Usuario
        .query()
        .preload('perfil')
        return user
    }

    //MOSTRAR TODOS LOS USUARIOS CON PUBLICACIONES
    public async getListarUsuariosYPublicaciones(): Promise<Usuario[]> {
        const user = await Usuario
        .query()
        .preload('publicacion')
        return user;
    }

    //MOSTRAR TODOS LOS USUARIOS QUE ESTÁN EN UN GRUPO
    public async getListarUsuariosGrupos(): Promise<Usuario[]> {
        const user = await Usuario
        .query()
        .preload('usuario_grupos')
        return user
    }

    
    //MOSTRAR LOS USUARIOS QUE CONTENGAN LA CADENA PASADA POR LA URL
    public async filtroPorNombre({request}: HttpContextContract){
        const search = request.param('search')
        const users = await Usuario.query().where('nombre_usuario','like',`${search}%`)
        return(users);
    }


}
