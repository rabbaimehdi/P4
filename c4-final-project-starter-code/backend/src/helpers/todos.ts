import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

export const getTodos = async(userId: string): Promise<TodoItem[] | Error> => {
	try {
		const userTodos = await getTodoHandler(userId)
		return userTodos as TodoItem[]
	} catch(e) {
		return createError(403, `Unauthorized.`)
	}
}


export const createTodo = async(userId: string, CreateTodoRequest: CreateTodoRequest): Promise<TodoItem | Error> => {
	const todoId = uuid.v4()
	const Todo: TodoItem = {
		userId,
		todoId,
		createdAt: new Date().toISOString(),
		done: false,
		attachmentUrl: null,
		...CreateTodoRequest
	}
	try {
		await createTodoHandler(Todo)
		logger.info(`The Item Was Created Successfully : `, {
			Todo
		})
		return Todo as TodoItem
	} catch(e) {
		return createError(403, `Unauthorized.`)
	}
}


export const updateTodo = async (userId: string, todoId: string, updatedTodo: UpdateTodoRequest): Promise<void | Error> => {
	logger.info(`Start Update `, {
		userId,
		todoId,
		updatedTodo
	})
	try {
		await updateTodoHandler(userId, todoId, updatedTodo)
		logger.info(`Item Update `, {
			userId,
			todoId,
			updatedTodo
		})
	} catch (e) {
		logger.info(`Update Error `, {
			Error: e,
			userId,
			todoId,
			updatedTodo
		})
		return createError(403, `Unauthorized.`)	
	}
}


export const deleteTodo = async(userId: string, todoId: string): Promise<void|Error> => {
	try {
		await deleteTodoHandler(userId, todoId)
	} catch(e) {
		return createError(403, `Unauthorized.`)	
	}
}

export const createAttachmentPresignedUrl = async(userId: string, todoId: string, attachmentId: string): Promise<string|Error> => {
	try {
		logger.info(`Start Image Upload `, {
			attachmentId
		})
		const data = await AttachmentUtils(attachmentId)
		await updateTodoWithUrlHandler(userId, todoId, data.uploadUrl)
		return data.s3SignedUrl
	} catch (e) {
		logger.info(`Error Image Upload`, {
			attachmentId
		})
		return createError(403, `Unauthorized.`)	
	}
}