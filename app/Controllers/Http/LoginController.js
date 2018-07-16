'use strict'

const User = use('App/Models/User')

class LoginController {
  async redirect({ ally }) {
    const url = await ally.driver('facebook').getRedirectUrl()
    return { url }
  }

  async callback({ ally, auth }) {
    try {
      const fbUser = await ally
        .driver('facebook')
        .getUser()

      const userDetails = {
        email: fbUser.getEmail(),
        token: fbUser.getAccessToken(),
        login_source: 'facebook'
      }

      const user = await User
        .findOrCreate({ email: fbUser.getEmail() }, userDetails)

      await auth.login(user)

      return {
        'tipo': 'Sucesso',
        'identificador': 'UsuarioAutenticado',
        'mensagem': 'Usuário autenticado com sucesso',
        userDetails
      }
    }
    catch (error) {
      return {
        'tipo': 'Falha',
        'identificador': 'FalhaAutenticacao',
        'mensagem': 'Ocorreu um erro ao realizar o login',
        error
      }
    }
  }
}

module.exports = LoginController
