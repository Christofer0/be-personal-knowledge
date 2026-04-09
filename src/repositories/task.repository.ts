import { db } from '../db';
import { tasks } from '../db/schema';
import { eq } from 'drizzle-orm';

export type Task = typeof tasks.$inferSelect;

export class TaskRepository {
  async getAll(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async getByProjectId(projectId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.projectId, projectId));
  }

  async getById(id: number): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    return result[0];
  }

  async create(data: typeof tasks.$inferInsert): Promise<Task> {
    const result = await db.insert(tasks).values(data).returning();
    const first = result[0];
    if (!first) throw new Error('Failed to create task');
    return first;
  }

  async update(id: number, data: Partial<typeof tasks.$inferInsert>): Promise<Task> {
    const result = await db
      .update(tasks)
      .set(data)
      .where(eq(tasks.id, id))
      .returning();
    const first = result[0];
    if (!first) throw new Error('Task not found or update failed');
    return first;
  }

  async delete(id: number): Promise<Task | undefined> {
    const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    return result[0];
  }
}
