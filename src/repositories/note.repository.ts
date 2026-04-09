import { db } from '../db';
import { notes, noteTags, tags } from '../db/schema';
import { eq, like, or, and, inArray } from 'drizzle-orm';

export type Note = typeof notes.$inferSelect;
export type Tag = { id: number; name: string };
export type NoteWithTags = Note & { tags: Tag[] };

export class NoteRepository {
  private async attachTags(noteList: Note[]): Promise<NoteWithTags[]> {
    if (noteList.length === 0) return [];
    
    const noteIds = noteList.map(n => n.id);
    const tagRows = await db
      .select({ noteId: noteTags.noteId, id: tags.id, name: tags.name })
      .from(noteTags)
      .innerJoin(tags, eq(noteTags.tagId, tags.id))
      .where(inArray(noteTags.noteId, noteIds));

    return noteList.map(n => ({
      ...n,
      tags: tagRows
        .filter(t => t.noteId === n.id)
        .map(t => ({ id: t.id, name: t.name })),
    }));
  }

  async getAll(projectId?: number, tagId?: number, search?: string): Promise<NoteWithTags[]> {
    const filters = [];
    if (projectId) filters.push(eq(notes.projectId, projectId));
    if (search) filters.push(or(like(notes.title, `%${search}%`), like(notes.content, `%${search}%`)));

    let result = filters.length > 0
      ? await db.select().from(notes).where(and(...filters))
      : await db.select().from(notes);

    if (tagId) {
      const taggedNoteIds = (await db.select({ noteId: noteTags.noteId }).from(noteTags).where(eq(noteTags.tagId, tagId))).map(r => r.noteId);
      result = result.filter(n => taggedNoteIds.includes(n.id));
    }

    return this.attachTags(result);
  }

  async getById(id: number): Promise<NoteWithTags | undefined> {
    const result = await db.select().from(notes).where(eq(notes.id, id)).limit(1);
    if (!result[0]) return undefined;
    const items = await this.attachTags([result[0]]);
    return items[0] ?? undefined;
  }

  async create(data: typeof notes.$inferInsert): Promise<NoteWithTags> {
    const result = await db.insert(notes).values(data).returning();
    const first = result[0];
    if (!first) throw new Error('Failed to create note');
    const items = await this.attachTags([first]);
    const finalResult = items[0];
    if (!finalResult) throw new Error('Failed to attach tags after create');
    return finalResult;
  }

  async update(id: number, data: Partial<typeof notes.$inferInsert>): Promise<NoteWithTags> {
    const result = await db.update(notes).set(data).where(eq(notes.id, id)).returning();
    const first = result[0];
    if (!first) throw new Error('Note not found or update failed');
    const items = await this.attachTags([first]);
    const finalResult = items[0];
    if (!finalResult) throw new Error('Failed to attach tags after update');
    return finalResult;
  }

  async delete(id: number): Promise<Note | undefined> {
    const result = await db.delete(notes).where(eq(notes.id, id)).returning();
    return result[0];
  }

  async addTag(noteId: number, tagId: number) {
    const result = await db.insert(noteTags).values({ noteId, tagId }).returning();
    return result[0];
  }

  async removeTag(noteId: number, tagId: number) {
    const result = await db.delete(noteTags).where(and(eq(noteTags.noteId, noteId), eq(noteTags.tagId, tagId))).returning();
    return result[0];
  }
}
