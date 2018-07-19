'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments()
      table.string('name')
      table.string('avatar').nullable()
      table.string('username', 80).nullable()
      table.string('email', 254)
      table.string('cpf', 14)
      table.string('provider_id').nullable()
      table.string('provider').nullable()
      table.string('password', 60)
      table.timestamps()
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
