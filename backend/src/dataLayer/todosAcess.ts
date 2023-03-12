import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

var AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess Class')

export class TodosAccess {
  constructor(
    private readonly dynamoDBClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    // private readonly tableIndex = process.env.TODOS_INDEX,
    private readonly tableName = process.env.TODOS_TABLE,
  ) {}

// getAllTodos : Query all todos items

  // async getAllTodos(userId: string): Promise<TodoItem[]> {
  //   logger.info('Query all todos')
  //   const res = await this.dynamoDBClient
  //     .query({
  //       TableName: this.tableName,
  //       IndexName: this.tableIndex,
  //       KeyConditionExpression: 'userId = :userId',
  //       ExpressionAttributeValues: {
  //         ':userId': userId
  //       }
  //     })
  //     .promise()

  //   const items = res.Items
  //   return items as TodoItem[]
  // }


// createTodo : Adds item to the table

  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('Add item to DynamoDB Table')

   const result =  await this.dynamoDBClient
      .put({
        TableName: this.tableName,
        Item: todoItem
      })
      .promise()
      logger.info('Item created', result)
    return todoItem as TodoItem
  }


// updateTodoItem : update the item in the url

//   async updateTodoItem(
//     todoId: string,
//     userId: string,
//     todoUpdate: TodoUpdate
//  ): Promise<TodoUpdate> {
//     logger.info(`Updating todoid: ${todoId}`)
//     const result = await this.dynamoDBClient
//       .update({
//         TableName: this.tableName,
//         Key: { userId, todoId },
//         ConditionExpression: 'attribute_exists(todoId)',
//         UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
//         ExpressionAttributeNames: { '#name': 'name' },
//         ExpressionAttributeValues: {
//           ':name': todoUpdate.name,
//           ':dueDate': todoUpdate.dueDate,
//           ':done': todoUpdate.done
//         },
//         ReturnValues: 'ALL_NEW'
//       })
//       .promise()

//       const todoItemUpdate = result.Attributes
//       logger.info("Item updated", todoItemUpdate)
//       return todoItemUpdate as TodoUpdate
//   }


  // deleteTodoItem : deletes the item using todoID

//   async deleteTodoItem(todoId: string, userId: string): Promise<string> {
//     logger.info('Delete todo item function is called')

//     const result = await this.dynamoDBClient
//       .delete({
//         TableName: this.tableName,
//         Key: {
//           todoId,
//           userId
//         }
//       })
//       .promise()
//       logger.info("Todo Item deleted", result)
//       return todoId as string
//   }
 }