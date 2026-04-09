import { db } from '../db';
import { tags } from '../db/schema';
import { eq } from 'drizzle-orm';

export type Tag = typeof tags.$inferSelect;

export class TagRepository {
  async getAll(): Promise<Tag[]> {
    return await db.select().from(tags);
  }

  async getById(id: number): Promise<Tag | undefined> {
    const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);
    return result[0];
  }

  async create(data: typeof tags.$inferInsert): Promise<Tag> {
    const result = await db.insert(tags).values(data).returning();
    const first = result[0];
    if (!first) throw new Error('Failed to create tag');
    return first;
  }

  async delete(id: number): Promise<Tag | undefined> {
    const result = await db.delete(tags).where(eq(tags.id, id)).returning();
    return result[0];
  }
}
