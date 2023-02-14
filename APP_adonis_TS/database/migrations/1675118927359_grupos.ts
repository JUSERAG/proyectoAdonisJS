import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Grupos extends BaseSchema {
  protected tableName = 'grupos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('codigo_grupo').primary().unsigned()
      table.string('nombre',100).notNullable()
      table.timestamps(false)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
