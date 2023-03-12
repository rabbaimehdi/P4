import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { TodoUpdate } from '../models/TodoUpdate'
import * as uuid from 'uuid'



const logger = createLogger("TodoAccess")
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()


export async function  getTodos (userId: string): Promise<TodoItem[]> {
    logger.info('Querying User task')
    const userTodos = await todosAccess.getAllTodos(userId)
    return userTodos; 
}


export async function createTodo (newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {
  logger.info('CreateTodo fct called')
  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const s3Attachment = attachmentUtils.getAttachmentUrl(todoId)
  const todoItem = {
    userId,
    todoId,
    createdAt,
    attachmentUrl: s3Attachment,
    done: false,
    ...newTodo
  }

  return await todosAccess.createTodoItem(todoItem)
}


export async function updateTodo(
  todoId: string, 
  todoUpdate: UpdateTodoRequest,
  userId: string ): Promise<TodoUpdate> {
  return todosAccess.updateTodoItem(todoId,userId, todoUpdate )
}
 

export async function deleteTodo(
  todoId: string,
  userId: string
  ): Promise<String> {
  return await todosAccess.deleteTodoItem(todoId, userId)
}


export async function createAttachmentPresignedUrl (
  todoId: string,
  userId: string): Promise<string> {
  logger.info("presigned url created for ", todoId, userId)
  return attachmentUtils.getUploadUrl(todoId)
}