import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Grupo from 'App/Models/Grupo'

export default class GruposController {

    //METODO REGISTRAR UN NUEVO GRUPO
    public async setRegistrarGrupo({request,response}: HttpContextContract){
        try {
            const dataGrupo = request.only(['codigo_grupo', 'nombre_grupo'])
            const codigoGrupo = dataGrupo.codigo_grupo
            const codigoGrupoExistente = await this.getValidarGrupoExistente(codigoGrupo)
            if(codigoGrupoExistente===0) {
                await Grupo.create(dataGrupo)
                response.status(200).json({'msg': 'Grupo registrado con exito'})
            }else{
                response.status(400).json({'msg': 'Código del grupo ya se encuntra registrado!!'})
            }
            
        } catch (error) {
            console.log(error)
            response.status(500).json({'msg':'Error en el servidor!!'})
        }
    }

    //FUNCIÓN PARA VALIDAR SI YA EXISTE UN GRUPO CON ESE CODIGO
    private async getValidarGrupoExistente(codigo_grupo: Number): Promise<Number> {
        const totalGrupo = await Grupo.query().where({'codigo_grupo':codigo_grupo}).count('*').from('grupos')
        return parseInt(totalGrupo[0]['count(*)'])
    }

    //METODO DE OBTENCIÓN DE TODOS LOS GRUPOS EXISTENTES
    public async getListarGrupos(): Promise<Grupo[]> {
        const group =  await Grupo.all()
        return group
    }

    //METODO DE ACTUALIZACIÓN DE GRUPOS
    public async putActualizarGrupo({request}: HttpContextContract) {
        try {
            const idGroup = request.param('id')
            const existGroup: Number = await this.getValidarGrupoExistente(idGroup)
            if (existGroup !== 0){
                const group = await Grupo.findOrFail(idGroup)
                const data = request.all()
                group.nombre_grupo = data.nombre_grupo
                group.save()
                return {'mensaje': 'Grupo actualizado con exito', 'estado': 200}
            }else{
                return {'mensaje': 'Grupo no existente', 'estado': 400}
            }
            
        } catch (error) {
            return {'mensaje': 'Error en el servidor', 'estado': 500}
        }
        
    }

    //METODO PARA BORRAR GRUPO
    public async deleteBorrarGrupo({request}: HttpContextContract) {
        try {
            const idGroup = request.param('id')
        const existeGrupo: Number = await this.getValidarGrupoExistente(idGroup)
        if (existeGrupo !== 0){
            await Grupo.query().where('codigo_grupo', idGroup).delete()
            return {'mensaje': 'Grupo eliminado con exito', 'estado': 200}
        }else{
            return {'mensaje': 'Grupo no existente', 'estado': 400}
        }
            
        } catch (error) {
            return {'mensaje': 'Error en el servidor', 'estado': 500}   
        }
        
    }



}
