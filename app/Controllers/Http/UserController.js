"use strict";

const User = use("App/Models/User");
const { validate } = use("Validator");
const Database = use("Database");

class UserController {
  async index() {
    const users = User.all();
    return users;
  }

  async create({ request, response }) {
    const data = request.only(["username", "email", "password"]);

    const rules = {
      username: "required|unique:users",
      email: "required|email|unique:users",
      password: "required"
    };

    const messages = {
      "username.required": "O nome de usuário não pode estar em branco.",
      "username.unique": "Nome de usuário já cadastrado.",
      "email.unique": "E-mail já cadastrado.",
      "email.email": "E-mail inválido.",
      "email.required": "O e-mail não pode estar em branco.",
      "password.required": "A senha não pode estar em branco."
    };

    const validation = await validate(data, rules, messages);

    if (validation.fails()) {
      const validationResult = validation.messages()[0];

      response.status(500).send({
        status: 500,
        tipo: "ErroValidacao",
        identificador: validationResult.validation + "ValidationError",
        mensagem: validationResult.message
      });
    } else {
      await User.create(data);
      response.status(200).send({
        status: 200,
        tipo: "Sucesso",
        identificador: "UsuarioCriado",
        mensagem: "Usuário criado com sucesso."
      });
    }
  }

  async show({ params, response }) {
    const user = await User.find(params.id);

    if (user == null) {
      response.status(404).send({
        status: 404,
        tipo: "NaoEncontrado",
        identificador: "UsuarioInexistente",
        mensagem: "Usuário Não Encontrado"
      });
    } else {
      return user;
    }
  }

  //MOSTRAR DADOS DO USUÁRIO ATUAL LOGADO
  async showMe({ auth, request, response }) {
    const user = await User.query()
      .where("id", auth.user.id)
      .with("roles")
      .first();
    const userJSON = user.toJSON();

    userJSON.roles = userJSON.roles.map(role => role.slug);

    return userJSON;
  }

  async destroy({ params, response }) {
    const user = await User.find(user.id);

    if (user == null) {
      response.status(404).send({
        status: 404,
        tipo: "Erro",
        identificador: "UsuarioInexistente",
        mensagem: "Usuário não encontrado."
      });
    } else {
      await user.delete();
      response.status(200).send({
        status: 200,
        tipo: "Sucesso",
        identificador: "UsuarioDeletado",
        mensagem: "Usuario deletado com sucesso"
      });
    }
  }
}

module.exports = UserController;
