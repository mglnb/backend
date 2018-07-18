"use strict";

const { validate } = use("Validator");
const User = use("App/Models/User");
class AuthController {
  async login({ request, response, auth }) {
    const { username, password } = request.all();
    // Regras da validação...
    const rules = {
      username: "required",
      password: "required"
    };

    const messages = {
      "username.required": "O nome de usuário não pode estar em branco!",
      "password.required": "A senha não pode estar em branco!"
    };

    // Tenta validar
    const validation = await validate({ username, password }, rules, messages);

    // Se validação dos campos falhar, retorna o erro
    if (validation.fails()) {
      const validationResult = validation.messages()[0];

      // Envia JSON com erro
      response.status(500).send({
        status: 500,
        tipo: "ErroValidacao",
        identificador: validationResult.validation + "ValidationError",
        mensagem: validationResult.message
      });

      // Verifica se credenciais estão corretas, se sim.. gera o token e retorna!
      try {
        const token = await auth.attempt(username, password);
        return token;
      } catch (e) {
        const error = { status: 401, tipo: "ErroAutenticacao" };

        // Se usuário inexistente...
        if (e.uidField) {
          response.status(401).send({
            ...error,
            identificador: "UsuarioInvalida",
            mensagem: "Usuário inexistente!"
          });
        }

        // Se senha está incorreta
        if (e.passwordField) {
          response.status(401).send({
            ...error,
            identificador: "SenhaInvalida",
            mensagem: "Senha Inválida!"
          });
        }
      }
    }
  }

  async handleProviderCallback({ request, params, response, auth, ally }) {
    const {
      access_token: accessToken,
      access_secret: accessSecret
    } = request.all();
    try {
      const userData = await ally
        .driver(params.provider)
        .getUserByToken(accessToken, accessSecret);
      const authUser = await User.query()
        .where({
          provider: params.provider,
          provider_id: userData.getId()
        })
        .first();
      console.log(authUser);

      if (authUser !== null) {
        const tokens = await auth.generate(authUser);
        return response.status(200).send({
          status: 200,
          tipo: "Sucesso",
          identificador: "LoginRealizado",
          mensagem: "Login realizado com sucesso",
          authUser,
          tokens
        });
      }

      const user = new User();
      user.name = userData.getName();
      user.username = userData.getNickname();
      user.email = userData.getEmail();
      user.provider_id = userData.getId();
      user.avatar = userData.getAvatar();
      user.provider = params.provider;
      await user.save();

      response.status(200).send({
        status: 200,
        tipo: "Sucesso",
        identificador: "CadastroRealizado",
        mensagem: "Cadastro realizado com sucesso",
        user
      });
    } catch (error) {
      response.status(500).send({
        status: 500,
        tipo: "Erro",
        identificador: "FalhaFacebook",
        mensagem: "Falha ao realizar login",
        error: error.message
      });
    }
  }

  async logout() {
    try {
      await auth.logout();
      response.status(200).send({
        status: 200,
        tipo: "Sucesso",
        identificador: "LogoutRealizado",
        mensagem: "Logout realizado"
      });
    } catch (err) {
      response.status(500).send({
        status: 500,
        tipo: "Erro",
        identificador: "FalhaLogout",
        mensagem: "Falha ao realizar logout"
      });
    }
  }
}

module.exports = AuthController;
