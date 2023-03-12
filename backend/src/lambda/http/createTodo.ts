import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
// import { stringify } from 'querystring'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const new_Todo: CreateTodoRequest = JSON.parse(event.body)

    const user_Id = getUserId(event)
    const new_Item = await createTodo(new_Todo, user_Id)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: new_Item
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
