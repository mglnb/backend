'use strict'

const Model = use('Model')

class RoleUser extends Model {
    static get table() {
        return 'role_user'
    }

    static get hidden() {
        return ['created_at', 'updated_at']
    }
}

module.exports = RoleUser
