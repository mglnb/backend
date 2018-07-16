"use strict";

const { validate } = use("Validator");

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
}

module.exports = AuthController;
