import { ProjectRepository } from '../repositories/project.repository';
import { projects } from '../db/schema';

export class ProjectService {
  private repository: ProjectRepository;

  constructor() {
    this.repository = new ProjectRepository();
  }

  async listProjects(status?: 'ongoing' | 'done') {
    return await this.repository.getAll(status);
  }

  async getProject(id: number) {
    const project = await this.repository.getById(id);
    if (!project) throw new Error('Project not found');
    return project;
  }

  async createProject(data: typeof projects.$inferInsert) {
    return await this.repository.create(data);
  }

  async updateProject(id: number, data: Partial<typeof projects.$inferInsert>) {
    const project = await this.getProject(id);
    return await this.repository.update(id, data);
  }

  async deleteProject(id: number) {
    await this.getProject(id);
    return await this.repository.delete(id);
  }
}
