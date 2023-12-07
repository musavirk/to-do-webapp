import { Task } from '../models/index.js';

export default class TaskService {
  static async createTask(data) {
    return Task.create(data);
  }

  static async getTasks(search = '') {
    const tasks = await Task.find();

    return tasks.filter((tasks) => {
      const searchToLower = search.toLocaleLowerCase();
      const status = String(tasks.status).toLocaleLowerCase();
      return status.includes(searchToLower);
    });
  }

  static async getTaskById(taskId) {
    return Task.findById(taskId);
  }

  static async updateTask(taskId, updatedData) {
    return Task.findByIdAndUpdate(taskId, updatedData, {
      new: true,
    });
  }

  static async deleteTask(taskId) {
    return Task.findByIdAndRemove(taskId);
  }
}
