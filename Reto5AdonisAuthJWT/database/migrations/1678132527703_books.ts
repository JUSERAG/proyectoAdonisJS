import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Books extends BaseSchema {
  protected tableName = 'books'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_book').primary()
      table.string('title', 255).notNullable()
      table.string('editorial', 180)
      table.string('format', 180)
      table.integer('number_page')
      table.integer('id_user').references('id_user').inTable('users')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
