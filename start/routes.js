'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.get('/', ({ request }) => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('/authenticated/:provider', 'AuthController.handleProviderCallback')
Route.get('/login', 'AuthController.login')
Route.get('/logout', 'AuthController.logout')

Route.resource('/users', 'UserController')
Route.resource('/roles', 'UserController')