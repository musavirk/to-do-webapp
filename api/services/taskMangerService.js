import { Task } from '../models/index.js';

export default class TaskService {
  static async createTask(data) {
    return Task.create(data);
  }

  static async getTasks(search = '') {
    // Define a query object to perform a search on all fields
    const searchQuery = {
      $or: [
        { status: { $regex: search, $options: 'i' } }, // Case-insensitive search in the 'name' field
      ],
    };

    return Task.find(searchQuery);
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
