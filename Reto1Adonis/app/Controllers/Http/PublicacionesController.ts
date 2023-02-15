import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Publicaciones from 'App/Models/Publicaciones'

export default class PublicacionesController {

    //METODO PARA REGISTRAR PUBLICACIONES
    async setRegistroPublicacion({request,response}: HttpContextContract){
        try {
            const dataPublicaciones = request.only([
                'codigo_publicacion', 'codigo_usuario', 'titulo', 'cuerpo'       
            ])
            const codigoPublicacion = dataPublicaciones.codigo_publicacion
            const codigoPublicacionExistente: Number = await this.getValidarPublicacionExistente(codigoPublicacion)
            if (codigoPublicacionExistente === 0){
                await Publicaciones.create(dataPublicaciones)
                response.status(200).json({'msg': 'Registro de publicaciones completado con exito'})
            }else{
                response.status(400).json({'msg': 'El codigo de la publicacion ya existe'})
            }
        } catch (error) {
            response.status(500).json({'msg': 'Error en el servidor'})
        }
    }

    //FUNCIÓN PARA VALIDAR LA EXISTENCIA DE UNA PUBLICACIÓN
    private async getValidarPublicacionExistente (codigo_publicacion: Number): Promise<Number> {
        const total = await Publicaciones.query().where({'codigo_publicacion':codigo_publicacion}).count('*').from('publicaciones')
        return(total[0]['count(*)'])
    }

    //METODO PARA MOSTRAR TODAS LAS PUBLICACIONES
    public async getListarPublicaciones(): Promise<Publicaciones[]> {
        const publication = await Publicaciones.all()
        return publication
    }

    //METODO PARA ACTUALIZAR PUBLICAIONES
    public async putActualizarPublicacion({request}: HttpContextContract) {
        try {
            const idpublication = request.param('id')
            const existPublicaction: Number = await this.getValidarPublicacionExistente(idpublication)
            if (existPublicaction !== 0){
                const publication = await Publicaciones.findOrFail(idpublication)
                const data = request.all()
                publication.titulo = data.titulo
                publication.cuerpo = data.cuerpo
                publication.save()
                return {'mensaje': 'Publicación actualizada con exito', 'estado': 200}    
            }else {
                return {'mensaje': 'No existe publicación con ese código', 'estado': 400}
            }
            
        } catch (error) {
            return {'mensaje': 'Error en el servidor', 'estado': 500}
        }
        
    }

    //METODO PARA BORRAR PUBLICACIONES
    public async deleteBorrarPublicacion({request}: HttpContextContract) {
        try {
            const idPublication = request.param('id')
            const existPublication: Number = await this.getValidarPublicacionExistente(idPublication)
            if(existPublication !== 0) {
                await Publicaciones.query().where('codigo_publicacion', idPublication).delete()
                return {'mensaje': 'Registro borrado con exito', 'estado': 200}    
            }else {
                return {'mensaje': 'No existe publicación con ese código', 'estado': 400}
            }
            
        } catch (error) {
            return {'mensaje': 'Error en el servidor', 'estado': 500}
        }
        
    }
}

