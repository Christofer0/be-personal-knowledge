import { pgTable, serial, text, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projects } from './project';
import { noteTags } from './tag';

export const noteTypeEnum = pgEnum('note_type', ['snippet', 'error', 'note']);

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: noteTypeEnum('type').default('note').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notesRelations = relations(notes, ({ one, many }) => ({
  project: one(projects, {
    fields: [notes.projectId],
    references: [projects.id],
  }),
  tags: many(noteTags),
}));
