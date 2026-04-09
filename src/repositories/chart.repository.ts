import { db } from '../db';
import { tasks, notes, projects } from '../db/schema';
import { eq, sql, gte, and } from 'drizzle-orm';

export class ChartRepository {
  async getActivityByDay(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [taskActivity, noteActivity] = await Promise.all([
      db
        .select({
          date: sql<string>`DATE(${tasks.createdAt})`.as('date'),
          count: sql<number>`COUNT(*)`.as('count'),
        })
        .from(tasks)
        .where(gte(tasks.createdAt, since))
        .groupBy(sql`DATE(${tasks.createdAt})`),

      db
        .select({
          date: sql<string>`DATE(${notes.createdAt})`.as('date'),
          count: sql<number>`COUNT(*)`.as('count'),
        })
        .from(notes)
        .where(gte(notes.createdAt, since))
        .groupBy(sql`DATE(${notes.createdAt})`),
    ]);

    return { tasks: taskActivity, notes: noteActivity };
  }

  async getTasksByStatus() {
    return db
      .select({
        status: tasks.status,
        count: sql<number>`COUNT(*)`.as('count'),
      })
      .from(tasks)
      .groupBy(tasks.status);
  }

  async getNotesByType() {
    return db
      .select({
        type: notes.type,
        count: sql<number>`COUNT(*)`.as('count'),
      })
      .from(notes)
      .groupBy(notes.type);
  }

  async getProjectsOverview() {
    const [taskCounts, noteCounts, allProjects] = await Promise.all([
      db
        .select({
          projectId: tasks.projectId,
          total: sql<number>`COUNT(*)`.as('total'),
          todo: sql<number>`COUNT(*) FILTER (WHERE ${tasks.status} = 'todo')`.as('todo'),
          doing: sql<number>`COUNT(*) FILTER (WHERE ${tasks.status} = 'doing')`.as('doing'),
          done: sql<number>`COUNT(*) FILTER (WHERE ${tasks.status} = 'done')`.as('done'),
        })
        .from(tasks)
        .groupBy(tasks.projectId),

      db
        .select({
          projectId: notes.projectId,
          count: sql<number>`COUNT(*)`.as('count'),
        })
        .from(notes)
        .groupBy(notes.projectId),

      db.select().from(projects),
    ]);

    return allProjects.map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      tasks: taskCounts.find((t) => t.projectId === p.id) ?? { total: 0, todo: 0, doing: 0, done: 0 },
      notesCount: noteCounts.find((n) => n.projectId === p.id)?.count ?? 0,
    }));
  }
}
