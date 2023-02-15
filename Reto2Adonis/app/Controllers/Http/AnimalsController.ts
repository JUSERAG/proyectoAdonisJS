import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Animal from 'App/Models/Animal'


export default class AnimalsController {

    //METODO REGISTRO

    public async postRegistrarAnimal({request, response}: HttpContextContract) {
        const dataAnimal = request.only([
            'codigo_animal', 'nombre_animal', 'especie', 'raza', 'genero', 'edad'
        ])
        try {
            const codigoAnimal = dataAnimal.codigo_animal
            const existeCodigoAnimal: Number = await this.getValidarExisteAnimal(codigoAnimal)
            if(existeCodigoAnimal === 0){
                await Animal.create(dataAnimal)
                response.status(200).json({'msg': 'Registro completado con exito'})
            }else{
                response.status(400).json({'msg': 'Error, ya existe animal registrado con ese codigo'})
            }
        } catch (error) {
            response.status(500).json({'msg': 'Error en el servidor'})
        }
        
        

    }

    //FUNCIÓN VALIDACIÓN

    private async getValidarExisteAnimal(codigo_animal : number): Promise<Number>{
        const totalAnimal = await Animal.query().where('codigo_animal', codigo_animal).count('* as total').from('animals')
        return parseInt(totalAnimal[0]['total'])
    }

    //METODOS DE CONSULTAS

    public async getListarAnimales(): Promise<Animal[]> {
        const animales = await Animal.all()
        return animales 
    }

    public async getFiltrarEspecie({request}: HttpContextContract) {
        const search = request.param('search')
        const animales = await Animal.query().where('especie', search).from('animals')
        return animales
    }

    public async getFiltrarMenoresOcho(): Promise<Animal[]> {
        const menores = await Animal.query().where('edad','<', 8).from('animals')
        return menores
    }

    public async getFiltrarMenores({request}: HttpContextContract) {
        const edad = request.param('edad')
        const animales = await Animal.query().where('edad','<',edad).from('animals')
        return animales
    }


    //METODO DE ACTUALIZACIÓN

    public async putActualizarAnimal({request}: HttpContextContract) {
        try {
            const codAnimal = request.param('codigo')
            const existeAnimal = await this.getValidarExisteAnimal(codAnimal)
            if (existeAnimal !== 0){
                const animal = await Animal.findOrFail(codAnimal)
                const datos = request.all()
                animal.nombre_animal = datos.nombre_animal
                animal.especie = datos.especie
                animal.raza = datos.raza
                animal.genero = datos.genero
                animal.edad = datos.edad
                animal.save()
                return {'msg': `Datos de ${animal.nombre_animal} actualizados correctamente`,'estado':200}
            }else{
                return {'msg': 'No existe mascota asociada con este codigo','estado':400}
            }
        } catch (error) {
            return {'msg': 'Error en el servidor','estado':500}
        }
    }


    //METODO DE ELIMINACIÓN
    
    public async deleteBorrarAnimal({request}: HttpContextContract) {
        const idAnimal = request.param('codigo')
        try {
            const existeAnimal = await this.getValidarExisteAnimal(idAnimal)
            if (existeAnimal !== 0){
                await Animal.query().where('codigo_animal',idAnimal).delete()
                return {'msg': `Animal con codigo ${idAnimal} eliminado con exito`, 'estado': 200} 
            }else{
                return {'msg': 'No existe animal asociado con este codigo', 'estado': 400}
            }
        } catch (error) {
            return {'msg': 'Error en el servidor', 'estado': 500}
        }
    }
}
