import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class Active {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const user = await auth.authenticate();
    if (!user.active) {
      return response.status(401).json({ message: "User not active" });
    }
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next();
  }
}
