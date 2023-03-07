import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_user').primary()
      table.string('name', 80).notNullable()
      table.string('lastname', 80)
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.integer('type_id', 20).notNullable()
      table.string('number_id',20).notNullable().unique().unsigned()
      table.string('address', 80)
      table.string('neighborhood', 50)
      table.string('town', 30)
      table.string('departament', 30)
      table.integer('profile').references('id_profile').inTable('profiles')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
