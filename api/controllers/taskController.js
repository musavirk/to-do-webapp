import { TaskService } from '../services/index.js';
import { taskValidation } from '../validation/index.js';
import { handleErrorResponse, handleSuccessResponse } from '../utils/index.js';

export const createTask = async (req, res) => {
  try {
    const { error } = taskValidation.validate(req.body, {
      allowUnknown: false,
    });
    if (error) {
      return handleErrorResponse(res, 400, error.details[0].message);
    }

    const task = await TaskService.createTask(req.body);
    return handleSuccessResponse(res, task);
  } catch (error) {
    return handleErrorResponse(res, 500, error.message, error);
  }
};

export const getTask = async (req, res) => {
  try {
    const { search } = req.query;
    let tasks;
    if (search) {
      tasks = await TaskService.getTasks(search);
    } else {
      tasks = await TaskService.getTasks();
    }
    return handleSuccessResponse(res, tasks);
  } catch (error) {
    return handleErrorResponse(res, 500, 'Failed to fetch Task ', error);
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await TaskService.getTaskById(req.params.id);
    if (!task) {
      return handleErrorResponse(res, 404, 'Task not found.');
    }
    return handleSuccessResponse(res, task);
  } catch (error) {
    return handleErrorResponse(res, 500, 'Failed to fetch task.', error);
  }
};

export const updateTask = async (req, res) => {
  try {
    const updatedTask = await TaskService.updateTask(req.params.id, req.body);
    if (!updatedTask) {
      return handleErrorResponse(res, 404, 'Task not found.');
    }
    return handleSuccessResponse(res, updatedTask);
  } catch (error) {
    return handleErrorResponse(res, 500, 'Failed to update task.', error);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await TaskService.deleteTask(req.params.id);
    if (!deletedTask) {
      return handleErrorResponse(res, 404, 'Task not found.');
    }
    return handleSuccessResponse(res, deletedTask);
  } catch (error) {
    return handleErrorResponse(res, 500, 'Failed to delete Task.', error);
  }
};
