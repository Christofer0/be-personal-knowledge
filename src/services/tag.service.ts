import { TagRepository } from '../repositories/tag.repository';
import { tags } from '../db/schema';

export class TagService {
  private repository: TagRepository;

  constructor() {
    this.repository = new TagRepository();
  }

  async listTags() {
    return await this.repository.getAll();
  }

  async createTag(data: typeof tags.$inferInsert) {
    return await this.repository.create(data);
  }

  async deleteTag(id: number) {
    const tag = await this.repository.getById(id);
    if (!tag) throw new Error('Tag not found');
    return await this.repository.delete(id);
  }
}
