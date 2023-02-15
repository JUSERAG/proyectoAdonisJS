// import { Response } from '@adonisjs/core/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Perfil from 'App/Models/Perfil';

export default class PerfilsController {

    //METODO REGISTRAR PERFIL
    async setRegistrarPerfil({request,response}: HttpContextContract) {
        try {
            const dataPerfil = request.only([
                'codigo_perfil', 'codigo_usuario', 'nombre_perfil', 'fecha_creacion'
            ])
            const codigoPerfil = dataPerfil.codigo_perfil;
            const perfilExistente: Number = await this.getValidarPerfilExistente(codigoPerfil);
            if (perfilExistente === 0){
                await Perfil.create(dataPerfil)
                response.status(200).json({'msg':'Registro de perfil completado'})
            }else{
                response.status(400).json({'msg':'Error, el codigo del perfil ya se encuentra registrado'})
            }
        } catch (error) {
            response.status(500).json({'msg':'Error en el servidor !!'})
        }
    }

    //FUNCIÓN PARA SABER SI YA ESTISTE UN PERFIL CON ESE MISMO CODIGO
    private async getValidarPerfilExistente(codigo_perfil: Number): Promise<Number>{
        const total = await Perfil.query().where({'codigo_perfil':codigo_perfil}).count('*').from('perfils')
        return parseInt(total[0] ['count(*)'])
    }


    //METODO PARA MOSTRAR TODOS LOS PERFILES EXISTENTES
    public async getListarPerfiles(): Promise<Perfil[]> {
        const profile = await Perfil.all()
        return profile
    }

    //METODO PARA ACTUALIZAR PERFILES
    public async putActualizarPerfil({request}: HttpContextContract) {
        try {
            const idProfile = request.param('id')
            const existeProfile: Number = await this.getValidarPerfilExistente(idProfile)
            if (existeProfile !== 0){
                const profile = await Perfil.findOrFail(idProfile)
                const data = request.all()
                profile.nombre_perfil = data.nombre_perfil
                profile.fecha_creacion = data.fecha_creacion
                await profile.save()
                return {'mensaje': 'actualizado correctamente', 'estado': 200}
            }else{
                return {'mensaje': 'No existe perfil con este código', 'estado': 400}
            }
            
        } catch (error) {
            return {'mensaje': 'Error en el servidor', 'estado': 500}
        }
    }

    //METODO PARA BORRAR PERFILES
    public async deleteBorrarPerfil({request}: HttpContextContract) {
        try {
            const idProfile = request.param('id')
            const existProfile: Number = await this.getValidarPerfilExistente(idProfile)
            if (existProfile !== 0){
                await Perfil.query().where('codigo_perfil',idProfile).delete()
                return {'mensaje': 'Perfil eliminado con exito', 'estado': 200}
            }else{
                return {'mensaje': 'No existe perfil con este código', 'estado': 400}
            }
                
        } catch (error) {
            return {'mensaje': 'Error en el servidor', 'estado': 500}
        }
        
    }
}
