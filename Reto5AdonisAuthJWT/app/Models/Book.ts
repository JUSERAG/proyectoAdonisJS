
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Book extends BaseModel {
  @column({ isPrimary: true }) public id_book: number
  @column() public title: string
  @column() public editorial: string
  @column() public format: string
  @column() public number_page: number
  @column() public id_user: number
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany (() => User, {
    localKey: 'id_user',
    foreignKey: 'id_user'
  })
  public user: HasMany<typeof User>
  
}
