import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import { schema } from "@ioc:Adonis/Core/Validator";
import Pet from "App/Models/Pet";
export default class PetsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const user = await auth.authenticate();
    const petSchema = schema.create({
      name: schema.string(),
      type: schema.string(),
      age: schema.number(),
    });
    const data = await request.validate({ schema: petSchema });
    data["user_id"] = user.id;
    const pet = await Pet.create(data);
    return response.status(201).json(pet);
  }

  public async index({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate();
    const pets = await user.related("pets").query();

    return response.status(200).json(pets);
  }

  public async show({ params, response, auth }: HttpContextContract) {
    const user = await auth.authenticate();
    const pet = await user
      .related("pets")
      .query()
      .where("id", params.id)
      .first();
    if (!pet) {
      return response.status(404).json({ message: "Pet not found" });
    }
    return response.status(200).json(pet);
  }

  public async update({
    params,
    request,
    response,
    auth,
  }: HttpContextContract) {
    const user = await auth.authenticate();
    const pet = await user
      .related("pets")
      .query()
      .where("id", params.id)
      .first();
    if (!pet) {
      return response.status(404).json({ message: "Pet not found" });
    }
    const data = request.only(["name", "type", "age", "user_id"]);
    pet.merge(data);
    await pet.save();
    return response.status(200).json(pet);
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const user = await auth.authenticate();
    const pet = await user
      .related("pets")
      .query()
      .where("id", params.id)
      .first();
    if (!pet) {
      return response.status(404).json({ message: "Pet not found" });
    }
    await pet.delete();
    return response.status(200).json({ message: "Pet deleted" });
  }
}
