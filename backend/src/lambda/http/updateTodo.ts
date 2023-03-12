import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todo_Id: string = event.pathParameters.todoId
    const updated_Todo: UpdateTodoRequest = JSON.parse(event.body)
    const user_Id: string = getUserId(event)
    console.log("user_Id ",user_Id )
    await updateTodo(todo_Id, updated_Todo,user_Id)
    return {
      statusCode: 204,
      
      body: ''
    }
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )