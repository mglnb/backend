"use strict";

const Role = use("App/Models/Role");
const User = use("App/Models/User");
const RoleUser = use("App/Models/RoleUser");
const { validate } = use("Validator");

class RoleController {
  // Busca todos os tipos de usuário
  async index({ request, response }) {
    const roles = Role.all();
    return roles;
  }

  // Cria um novo tipo de usuário
  async create({ request, response }) {
    const data = request.only(["name", "slug", "description"]);
    const role = new Role();

    role.name = data.name;
    role.slug = data.slug;
    role.description = data.description;

    const rules = {
      slug: "required|unique:roles",
      name: "required|unique:roles"
    };

    const messages = {
      unique: "Tipo de usuário já cadastrado!",
      "slug.required": "O slug do tipo de usuário não deve estar em branco!",
      "name.required": "O nome do tipo de usuário não deve estar em branco!"
    };

    const validation = await validate(data, rules, messages);

    // Checa se validação falhou
    if (validation.fails()) {
      const validationResult = validation.messages()[0];

      // Retorna erro de validação
      response.status(500).send({
        status: 500,
        tipo: "ErroValidacao",
        identificador: validationResult.validation + "ValidationError",
        mensagem: validationResult.message
      });
    } else {
      // Se passou na validação, cria tipo de usuário
      await role.save();
      response.status(200).send({
        status: 201,
        tipo: "Sucesso",
        identificador: "TipoUsuarioCriado",
        mensagem: "Tipo de usuário criado com sucesso!"
      });
    }
  }

  // Deleta tipo de usuário
  async destroy({ params, response }) {
    const role = await Role.find(params.id);

    // Se o tipo de usuário é inexistente, retorna 404
    if (role == null) {
      response.status(404).send({
        status: 404,
        tipo: "Erro",
        identificador: "TipoUsuarioNaoEncontrado",
        mensagem: "Tipo de usuário não encontrado."
      });
    } else {
      // Se existir, deleta com sucesso
      await role.delete();
      response.status(200).send({
        status: 200,
        tipo: "Sucesso",
        identificador: "TipoUsuarioDeletado",
        mensagem: "Tipo de usuário deletado com sucesso"
      });
    }
  }

  async show({ params, response }) {
    const role = await Role.find(params.id);

    if (role == null) {
      response.status(404).send({
        status: 404,
        tipo: "NaoEncontrado",
        identificador: "TipoUsuarioInexistente",
        mensagem: "Tipo de usuário não encontrado."
      });
    } else {
      return role;
    }
  }

  // Atribui um tipo de usuário para algum usuário
  async setRoleUser({ params, request, response }) {
    const role = await Role.find(params.idRole);
    const user = await User.find(params.idUser);

    // Se não achar o USUÁRIO em questão, retorna 404
    if (user == null) {
      response.status(404).send({
        status: 404,
        tipo: "Erro",
        identificador: "UsuarioNaoEncontrado",
        mensagem: "Usuário não encontrado."
      });
    }
    // Se não achar o tipo de usuário em questão, retorna 404
    else if (role == null) {
      response.status(404).send({
        status: 404,
        tipo: "Erro",
        identificador: "TipoUsuarioNaoEncontrado",
        mensagem: "Tipo de usuário não encontrado."
      });
    } else {
      // Se der tudo certo, atribui o tipo de usuário ao usuário em questão
      await user.roles().attach(role.id);
      response.status(200).send({
        status: 200,
        tipo: "Sucesso",
        identificador: "UserRoleAttached",
        mensagem: "O usuário em questão agora é um " + role.description
      });
    }
  }

  // Remove o tipo do usuário de algum usuário
  async removeRoleUser({ params, request, response }) {
    const role = await Role.find(params.idRole);
    const user = await User.find(params.idUser);
    const roleUser = await RoleUser.query()
      .where("role_id", params.idRole)
      //.where('user_id', params.idUser)
      .fetch();
    const error404 = {
      status: 404,
      tipo: "Erro"
    };

    // Se não encontrar o usuário...
    if (user == null) {
      response.status(404).send({
        ...error404,
        identificador: "UsuarioNaoEncontrado",
        mensagem: "Usuário não encontrado."
      });
    }

    // Se não encontrar o tipo de usuário..
    if (role == null) {
      response.status(404).send({
        ...error404,
        identificador: "TipoUsuarioNaoEncontrado",
        mensagem: "Tipo de usuário não encontrado."
      });
    }

    // Se por exemplo... Tentar tirar a pessoa de administrador, sendo que ele não é um admin
    if (roleUser == null) {
      response.status(404).send({
        ...error404,
        identificador: "RelacionamentoUserRoleNaoEncontrado",
        mensagem: "O usuário em questão não é um " + role.name
      });
    }
    // Se tudo funfar, executa com sucesso
    await user.roles().detach(role.id);
    response.status(200).send({
      status: 200,
      tipo: "Sucesso",
      identificador: "UserRoleDetached",
      mensagem: "O usuário em questão não é mais um " + role.name
    });
  }
}

module.exports = RoleController;
