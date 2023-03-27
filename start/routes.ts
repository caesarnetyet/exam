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
import Event from '@ioc:Adonis/Core/Event'
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/post', async( {response} ) => {
  Event.emit('new:post', 'new post')
  return response.ok({message: 'post created'})
})

Route.post('/testEvent',async({response})=> {
  Event.emit('testEvent', 'testEvent')
  return response.ok({message: 'testEvent created'})
})

Route.get('/events', async({response}) => {
  const stream = response.response
  stream.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  })
   Event.on('new:post', (post)=> {
    stream.write(`event: message\ndata: ${post}\n\n`)
   })
   Event.on('testEvent', (testEvent)=> {
    stream.write(`event: other\ndata: ${testEvent}\n\n`)
   })
} )
