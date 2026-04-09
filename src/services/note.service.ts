import { NoteRepository } from '../repositories/note.repository';
import { notes } from '../db/schema';

export class NoteService {
  private repository: NoteRepository;

  constructor() {
    this.repository = new NoteRepository();
  }

  async listNotes(projectId?: number, tagId?: number, search?: string) {
    return await this.repository.getAll(projectId, tagId, search);
  }

  async getNote(id: number) {
    const note = await this.repository.getById(id);
    if (!note) throw new Error('Note not found');
    return note;
  }

  async createNote(data: typeof notes.$inferInsert) {
    return await this.repository.create(data);
  }

  async updateNote(id: number, data: Partial<typeof notes.$inferInsert>) {
    await this.getNote(id);
    return await this.repository.update(id, data);
  }

  async deleteNote(id: number) {
    await this.getNote(id);
    return await this.repository.delete(id);
  }

  async addTagToNote(noteId: number, tagId: number) {
    return await this.repository.addTag(noteId, tagId);
  }

  async removeTagFromNote(noteId: number, tagId: number) {
    return await this.repository.removeTag(noteId, tagId);
  }
}
