import { db } from '../db';
import { projects } from '../db/schema';
import { eq } from 'drizzle-orm';

export type Project = typeof projects.$inferSelect;

export class ProjectRepository {
  async getAll(status?: 'ongoing' | 'done'): Promise<Project[]> {
    if (status) {
      return await db.select().from(projects).where(eq(projects.status, status));
    }
    return await db.select().from(projects);
  }

  async getById(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async create(data: typeof projects.$inferInsert): Promise<Project> {
    const result = await db.insert(projects).values(data).returning();
    const first = result[0];
    if (!first) throw new Error('Failed to create project');
    return first;
  }

  async update(id: number, data: Partial<typeof projects.$inferInsert>): Promise<Project> {
    const result = await db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning();
    const first = result[0];
    if (!first) throw new Error('Project not found or update failed');
    return first;
  }

  async delete(id: number): Promise<Project | undefined> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result[0];
  }
}
