import { Elysia, t } from 'elysia';
import { NoteService } from '../services/note.service';

const noteService = new NoteService();

export const noteController = new Elysia()
  .group('/notes', (app) => 
    app
      .get('/', ({ query }) => noteService.listNotes(undefined, undefined, query.search), {
        query: t.Optional(t.Object({
          search: t.Optional(t.String())
        }))
      })
      .get('/:id', ({ params, set }) => {
        try {
          return noteService.getNote(Number(params.id));
        } catch (e: any) {
          set.status = 404;
          return { error: e.message };
        }
      })
      .post('/', ({ body, set }) => {
        try {
          set.status = 201;
          return noteService.createNote(body as any);
        } catch (e: any) {
          set.status = 400;
          return { error: e.message };
        }
      }, {
        body: t.Object({
          projectId: t.Number(),
          title: t.String(),
          content: t.String(),
          type: t.Optional(t.Union([t.Literal('snippet'), t.Literal('error'), t.Literal('note')]))
        })
      })
      .put('/:id', ({ params, body, set }) => {
        try {
          return noteService.updateNote(Number(params.id), body as any);
        } catch (e: any) {
          set.status = e.message === 'Note not found' ? 404 : 400;
          return { error: e.message };
        }
      }, {
        body: t.Object({
          title: t.Optional(t.String()),
          content: t.Optional(t.String()),
          type: t.Optional(t.Union([t.Literal('snippet'), t.Literal('error'), t.Literal('note')]))
        })
      })

      .delete('/:id', ({ params, set }) => {
        try {
          return noteService.deleteNote(Number(params.id));
        } catch (e: any) {
          set.status = 404;
          return { error: e.message };
        }
      })
      .post('/:id/tags', ({ params, body, set }) => {
        try {
          return noteService.addTagToNote(Number(params.id), Number(body.tagId));
        } catch (e: any) {
          set.status = 400;
          return { error: e.message };
        }
      }, {
        body: t.Object({
          tagId: t.Number()
        })
      })
      .delete('/:id/tags/:tag_id', ({ params, set }) => {
        try {
          return noteService.removeTagFromNote(Number(params.id), Number(params.tag_id));
        } catch (e: any) {
          set.status = 400;
          return { error: e.message };
        }
      })
  )
  .get('/projects/:id/notes', ({ params }) => noteService.listNotes(Number(params.id)));
