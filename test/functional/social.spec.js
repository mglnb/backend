const { test, trait, before } = use("Test/Suite")("Social Login");
const User = use("App/Models/User");
const Env = use("Env");
trait("Test/ApiClient");
trait("DatabaseTransactions");

test("should register or login with fb", async ({ client, ally }) => {
  console.log(ally)
  const authUser = await User.query()
    .where({
      provider: "facebook",
      email: response.body.user.email
    })
    .first();
  const response = await client
    .post("/authenticated/facebook")
    .send({
      access_token: Env.get("FB_ACCESS_TOKEN")
    })
    .end();

  console.log(authUser);
  if (authUser !== null) {
    response.assertStatus(200);
    response.assertJSONSubset({
      identificador: "LoginRealizado",
      mensagem: "Login realizado com sucesso"
    });
  } else {
    response.assertStatus(200);
    response.assertJSONSubset({
      identificador: "CadastroRealizado",
      mensagem: "Cadastro realizado com sucesso"
    });
  }
});

/**
 * @todo
 */
test("should register with twitter", async ({ client }) => {
  const response = await client
    .post("/authenticated/twitter")
    .send({
      access_token: Env.get("TWITTER_ACCESS_TOKEN"),
      access_secret: Env.get("TWITTER_ACCESS_SECRET")
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    identificador: "CadastroRealizado",
    mensagem: "Cadastro realizado com sucesso"
  });
});

test("should login with fb", async ({ client }) => {
  const response = await client
    .post("/authenticated/facebook")
    .send({
      access_token: Env.get("FB_ACCESS_TOKEN")
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    identificador: "LoginRealizado",
    mensagem: "Login realizado com sucesso"
  });
});

/**
 * @todo
 */
test("should login with twitter", async ({ client }) => {
  const response = await client
    .post("/authenticated/twitter")
    .send({
      access_token: Env.get("TWITTER_ACCESS_TOKEN"),
      access_secret: Env.get("TWITTER_ACCESS_SECRET")
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    identificador: "LoginRealizado",
    mensagem: "Login realizado com sucesso"
  });
});
