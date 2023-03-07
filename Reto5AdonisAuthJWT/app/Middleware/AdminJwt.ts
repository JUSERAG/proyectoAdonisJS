import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from 'App/Controllers/Http/UsersController'
import User from 'App/Models/User'

export default class AdminJwt {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const authorizationHeader:any = ctx.request.header('authorization')

    try {
      const {id_user, profile} = await UsersController.obtenerPayload(authorizationHeader)
      const user = await User.find(id_user)
      if (!user){
        return ctx.response.status(401).json({
          'msg': 'Token no valido'})
      }

      if(profile !== 'Administrador'){
        return ctx.response.status(401).json({
          'msg': 'No tiene autorización para está acción'})
      }

      await next()
    } catch (error) {
      return ctx.response.status(400).json({
        'msg': 'Token no valido'})
    }
  }
}
