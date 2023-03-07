import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import Profile from 'App/Models/Profile'
const bcryptjs = require('bcryptjs')

export default class UsersController {

    public async registerUser({request}: HttpContextContract){
        const {name, email, password, type_id, number_id, profile} = request.all();
        try {
          const existID = await User.findBy('number_id', number_id)
          const existEmail = await User.findBy('email', email)
          if (!existID && !existEmail){
            const salt = bcryptjs.genSaltSync();
            const user = new User();
            user.name = name;
            user.email = email;
            user.password = bcryptjs.hashSync( password, salt );
            user.type_id = type_id;
            user.number_id = number_id;
            user.profile = profile;  
            await user.save();
            return{
              user, 
              'msg': 'Usuario registrado',
              'status': 200
            } 

          }

          return {
            number_id,
            email,
            'msg': 'La cedula o correo ya se encuentra registrad@',
            'status': 400
          }
          
        } catch (error) {
          return {  
            'msg': 'Error en el servidor',
            'status': 500
          }
        }
        
      }
      
      public async login({request, response}: HttpContextContract){
        const email = request.input('email');
        const password = request.input('password');
        try {
          //consultar si existe user con ese correo
          const user = await User.findBy('email', email)
          if(!user){
            return response.status(400).json({msj: 'El user no existe'})
          }
          
          const validPassword = bcryptjs.compareSync( password, user.password );
          if ( !validPassword ) {
            return response.status(400).json({msj: 'Los datos de acceso son incorrectos'})
          }
          const profile = await Profile.find(user.profile)
          if (!profile){
            return response.status(400).json({msj: 'No cuenta con un perfil'})
          }
          //Validar si la contraseña ingresada es igual a la del usaurio
          const payload = {
            'name': user.name,
            'id_user': user.id_user,
            'number_id': user.number_id,
            'profile': profile.name
          }
          const token:string = this.generarToken(payload);
    
          response.status(200).json({
            token,
            'msg': 'Usuario logueado'})
        } catch (error) {
          response.json({'msg': 'Credenciales invalidas'});
        }
      }
    
      public generarToken(payload: any):string{
        const opciones = {
          expiresIn: '5 mins'
        }
        return jwt.sign(payload, Env.get('JWT_SECRET_KEY'), opciones)    
      }
    
      public verificarToken(authorizationHeader:string){
        let token = authorizationHeader.split(' ')[1]
        token = jwt.verify(token, Env.get('JWT_SECRET_KEY'), (error)=>{
            if(error){
                throw new Error('Token expirado');
                
            }
        })
        return true
      }
      
      public static obtenerPayload (authorizationHeader:string) {
        let token = authorizationHeader.split(' ')[1]
        const payload = jwt.verify(token, Env.get('JWT_SECRET_KEY'), {complete: true}).payload
        console.log(payload)
        return payload
      }

      public async listUsers(): Promise<User[]>{
        return await User.all()
      }

      public async listUser({request}:HttpContextContract){
        return await User.find(request.param('id'))
    }

      public async updateUser({request}: HttpContextContract) {
        const id_user = request.param('id')
        try {
            const user = await User.find(id_user)
            const existProfile = await Profile.find(request.input('profile'))
            if (user && existProfile) {
                const salt = bcryptjs.genSaltSync()
                const dataUser = request.all()
                user.name = dataUser.name
                user.email = dataUser.email
                user.password = bcryptjs.hashSync(dataUser.password, salt)
                user.type_id = dataUser.type_id
                user.number_id = dataUser.number_id
                user.profile = dataUser.profile
                if(await user.save()) {
                    return {
                        'msg': 'Se actualizó el usuario con exito',
                        'status': 200
                    }
                }
                return {
                    'msg': 'No fue posible actualizar el usuario',
                    'status': 401
                }
            }
            return {
                'msg': 'No existe usuario o perfil que le quiere añadir',
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

    public async deleteUser ({request}: HttpContextContract) {
        const id_user = request.param('id')
        try {
            const existUser = await User.find(id_user)
            if(!existUser){
                return {
                    'msg': 'NO existe usuario con esa identificación',
                    'status': 400
                }
            }
            if (! await User.query().where('id_user', id_user).delete()){
                return {
                    'msg': 'No se pudo eliminar el usuario',
                    'status': 501
                }
            }
            return {
                'msg': 'Se eliminó el usuario con exito',
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
    