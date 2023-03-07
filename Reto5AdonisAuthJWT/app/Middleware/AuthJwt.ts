import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from 'App/Controllers/Http/UsersController'

export default class AuthJwt {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const authorizationHeader = ctx.request.header('Authorization')
    if(authorizationHeader == undefined) {
      return  ctx.response.status(400).send({
        mensaje: 'Falta el token de authorización',
        estado: 401,
      })
    }
    const token = authorizationHeader

    try {
      const usersController = new UsersController()
      usersController.verificarToken(token)
      await next()
    } catch (error) {
      ctx.response.status(400).send('Token incorrecto')
    }
  }
}
