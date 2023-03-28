/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/
import Event from "@ioc:Adonis/Core/Event";
import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});

Route.group(() => {
  Route.post("/", "UsersController.store");
  Route.get("/", "UsersController.index");
  Route.post("/login", "UsersController.login");
  Route.group(() => {
    Route.get("/:id", "UsersController.show");
    Route.put("/:id", "UsersController.update");
    Route.delete("/:id", "UsersController.destroy");
  })
    .where("id", "[0-9]+")
    .middleware(["auth:api", "active"]);
}).prefix("users");

Route.group(() => {
  Route.post("/", "PetsController.store");
  Route.get("/", "PetsController.index");
  Route.get("/:id", "PetsController.show").where("id", "[0-9]+");
  Route.put("/:id", "PetsController.update").where("id", "[0-9]+");
  Route.delete("/:id", "PetsController.destroy").where("id", "[0-9]+");
})
  .prefix("pets")
  .middleware(["auth:api", "active"]);

Route.get("/events", async ({ response }) => {
  const stream = response.response;
  stream.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });
  Event.on("new:post", (post) => {
    stream.write(`event: message\ndata: ${post}\n\n`);
  });
  Event.on("testEvent", (testEvent) => {
    stream.write(`event: other\ndata: ${testEvent}\n\n`);
  });
});
