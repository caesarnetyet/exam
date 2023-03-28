import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Ws from "App/Services/Ws";

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userSchema = schema.create({
      name: schema.string(),
      email: schema.string({}, [
        rules.email(),
        rules.unique({ table: "users", column: "email" }),
      ]),
      password: schema.string(),
    });
    const data = await request.validate({ schema: userSchema });
    const user = await User.create(data);

    Ws.io.emit("new:pet", user);
    return response.status(201).json(user);
  }

  public async index({ response }: HttpContextContract) {
    const users = await User.all();
    return response.status(200).json(users);
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const loginSchema = schema.create({
      email: schema.string({}, [
        rules.email(),
        rules.exists({ table: "users", column: "email" }),
      ]),
      password: schema.string(),
    });
    const { email, password } = await request.validate({ schema: loginSchema });
    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "Missing email or password" });
    }
    const token = await auth.use("api").attempt(email, password, {
      expiresIn: "10 days",
    });
    return response.status(200).json(token);
  }
  public async show({ params, response }: HttpContextContract) {
    const user = await User.find(params.id);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    return response.status(200).json(user);
  }

  public async update({ params, request, response }: HttpContextContract) {
    const user = await User.find(params.id);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    const userSchema = schema.create({
      name: schema.string(),
      email: schema.string({}, [
        rules.email(),
        rules.unique({ table: "users", column: "email" }),
      ]),
      password: schema.string(),
    });
    const data = await request.validate({ schema: userSchema });
    user.merge(data);
    await user.save();
    return response.status(200).json(user);
  }

  public async destroy({ params, response }: HttpContextContract) {
    const user = await User.find(params.id);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    await user.delete();

    Ws.io.emit("delete:pet", user);
    return response.status(200).json({ message: "User deleted" });
  }
}
