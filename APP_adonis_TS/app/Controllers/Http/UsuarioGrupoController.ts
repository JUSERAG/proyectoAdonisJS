
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Grupo from 'App/Models/Grupo'
import Usuario from 'App/Models/Usuario'
import UsuarioGrupo from 'App/Models/UsuarioGrupo'


export default class UsuarioGrupoController {

    //METODO PARA REGISTRAR UN NUEVO GRUPO ASOCIOADO A UN USUARIO
    public async setRegistrarUsuarioGrupo({request, response}: HttpContextContract){
        try {
            const dataGrupoUsuario = request.only(['codigo_usuario', 'codigo_grupo', 'fecha_inicio'])
            const codigo_usuario = dataGrupoUsuario.codigo_usuario
            const codigo_grupo = dataGrupoUsuario.codigo_grupo
            const datos_existentes: Number = await this.getValidarDatosGrupoYUsuario(codigo_grupo,codigo_usuario)
            switch (datos_existentes) {
                case 0:
                    await UsuarioGrupo.create(dataGrupoUsuario)
                    response.status(200).json({'msg': 'Registro de usuario en grupo completo'})
                    break;

                case 1:
                    response.status(400).json({'msg': 'El codigo de usuario no se encuentra registrado'})
                    break;
                case 2:
                    response.status(400).json({'msg': 'El codigo de grupo no se encuentra  registrado'})
                    break;
            
            }
        } catch (error) {
            console.log(error)
            response.status(500).json({'msg':'Error en el servidor !!'})
        }
    }

    //METODO  PARA VALIDAR SI YA EXISTE UN GRUPO ASOCIADO A ESE USUARIO Y MISMO GRUPO
    private async getValidarDatosGrupoYUsuario(codigo_grupo: Number, codigo_usuario: Number): Promise<Number> {
        let totalGrupo = await Grupo.query().where({'codigo_grupo':codigo_grupo}).count('*').from('grupos')
        let cantidadDatosGrupo = parseInt(totalGrupo[0]['count(*)'])
        if (cantidadDatosGrupo !== 0){
            let totalUsuario = await Usuario.query().where({'codigo_usuario':codigo_usuario}).count('*').from('usuarios')
            let cantidadDatosUsuario = parseInt(totalUsuario[0] ['count(*)'])
            if (cantidadDatosUsuario !== 0){
                return 0;
            }else{
                return 2;
            }
        }else{
            return 1;
        }
    }




}