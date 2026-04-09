import { TaskRepository } from '../repositories/task.repository';
import { tasks } from '../db/schema';

export class TaskService {
  private repository: TaskRepository;

  constructor() {
    this.repository = new TaskRepository();
  }

  async listTasks(projectId?: number) {
    if (projectId) {
      return await this.repository.getByProjectId(projectId);
    }
    return await this.repository.getAll();
  }

  async getTask(id: number) {
    const task = await this.repository.getById(id);
    if (!task) throw new Error('Task not found');
    return task;
  }

  async createTask(data: typeof tasks.$inferInsert) {
    return await this.repository.create(data);
  }

  async updateTask(id: number, data: Partial<typeof tasks.$inferInsert>) {
    await this.getTask(id);
    return await this.repository.update(id, data);
  }

  async deleteTask(id: number) {
    await this.getTask(id);
    return await this.repository.delete(id);
  }
}
