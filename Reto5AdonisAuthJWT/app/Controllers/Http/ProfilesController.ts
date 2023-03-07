import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile';

export default class ProfilesController {

    public async registerProfile({request}: HttpContextContract){
        const {id_profile, name} = request.all();
        const profile = new Profile();
        if(id_profile){
            profile.id_profile = id_profile
        }
        profile.name = name;
        await profile.save();
        return{profile, "msj": "Perfil registrado"}
    }

    public async listProfiles(): Promise<Profile[]> {
        return await Profile.all()
    }

    public async listProfile({request}:HttpContextContract){
        return await Profile.find(request.param('id'))
    }

    public async updateProfile({request}: HttpContextContract) {
        const id_profile = request.param('id')
        try {
            const profile = await Profile.find(id_profile)
            if(! profile){
                return {
                    'msg': 'No existe perfil con ese identificador',
                    'status': 401
                }
            }
            const name = request.input('name')
            profile.name = name
            if(await profile.save()){
                return {
                    profile,
                    'msg': 'Se actualizó el perfil correctamente',
                    'status': 200
                }
                
            }
            return {
                'msg': 'No fue posible actualizar este perfil',
                'status': 401
            }
            
        } catch (error) {
            console.log(error)
            return {
                'msg': 'Error en el servidor',
                'status': 500
            }
        }
    }

    public async deleteProfile({request}: HttpContextContract) {
        const id_profile = request.param('id')
        try {
            const profile = await Profile.find(id_profile)
            if(! profile ){
                return {
                    'msg': 'No existe perfil con ese identificador',
                    'status': 401
                }
            }
            if (! await Profile.query().where('id_profile', id_profile).delete()){
                return {
                    'msg': 'No se pudo eliminar el perfil',
                    'status': 401
                }
            }
            return {
                'msg': 'Perfil eliminado con exito',
                'status': 200
            }

        } catch (error) {
            return {
                'msg': 'Error en el servidor',
                'status': 500
            }
        }
    }
}
