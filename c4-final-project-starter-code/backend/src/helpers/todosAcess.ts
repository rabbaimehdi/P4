import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

const secondaryIndex = process.env.TODOS_INDEX
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
const TodoTable = process.env.TODOS_TABLE


export const getTodoHandler = async(userId: string): Promise<TodoItem[]> => {
	const queryData = await docClient.query({
		TableName: TodoTable,
		IndexName: secondaryIndex,
		KeyConditionExpression: 'userId = :userId',
		ExpressionAttributeValues: {
			':userId': userId
		}
	}).promise()
	const todos = queryData.Items
	return todos as TodoItem[]
}


export const createTodoHandler = async (todoItem: TodoItem): Promise<TodoItem> => {
    await docClient
      .put({
        TableName: TodoTable,
        Item: todoItem
      })
      .promise()
    return todoItem
  }
  
  export const deleteTodoHandler = async(userId: string, todoId: string): Promise<void> =>{
	await docClient.delete({
		TableName: TodoTable,
		Key: {
			userId,
			todoId
		}
	}).promise()
}

export const updateTodoHandler = async(userId: string, todoId: string, todosUpdate: TodoUpdate): Promise<void> => {
    await docClient.update({
       TableName: TodoTable,
       Key: {
           userId,
           todoId
       },
       UpdateExpression: 'name = :name, dueDate = :dueDate, done = :done',
       ExpressionAttributeNames: {
           '#name': 'name'
       },
       ExpressionAttributeValues: {
           ':name': todosUpdate.name,
           ':dueDate': todosUpdate.dueDate,
           ':done': todosUpdate.done
       }
   }).promise()
   return
}

export const updateTodoWithUrlHandler = async(userId: string, todoId: string, attachmentUrl: string): Promise<void> => {
	await docClient.update({
		TableName: TodoTable,
		Key: {
			userId,
			todoId
		},
		UpdateExpression: 'attachmentUrl = :attachmentUrl',
		ExpressionAttributeValues: {
			':attachmentUrl': attachmentUrl
		}
	}).promise()
	
}

