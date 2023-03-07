import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'

export default class User extends BaseModel {
  @column({ isPrimary: true }) public id_user: number
  @column() public name: string
  @column() public lastname: string
  @column() public email: string
  @column() public password: string
  @column() public type_id: number
  @column() public number_id: string
  @column() public address: string
  @column() public neighborhood: string
  @column() public town: string
  @column() public departament: string
  @column() public profile: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //relacion de 1:n con perfil
  @hasMany(() => Profile, {
    localKey: 'profile',
    foreignKey: 'id_profile',
  })
  public perfilUsuario: HasMany<typeof Profile>

}
