import { pgTable, serial, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tasks } from './task';
import { notes } from './note';

export const projectStatusEnum = pgEnum('project_status', ['ongoing', 'done']);

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: projectStatusEnum('status').default('ongoing').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
  notes: many(notes),
}));
