import { Elysia, t } from 'elysia';
import { TaskService } from '../services/task.service';

const taskService = new TaskService();

export const taskController = new Elysia()
  .group('/tasks', (app) => 
    app
      .get('/', () => taskService.listTasks())
      .get('/:id', ({ params, set }) => {
        try {
          return taskService.getTask(Number(params.id));
        } catch (e: any) {
          set.status = 404;
          return { error: e.message };
        }
      })
      .post('/', ({ body, set }) => {
        try {
          set.status = 201;
          return taskService.createTask(body as any);
        } catch (e: any) {
          set.status = 400;
          return { error: e.message };
        }
      }, {
        body: t.Object({
          projectId: t.Number(),
          title: t.String(),
          status: t.Optional(t.Union([t.Literal('todo'), t.Literal('doing'), t.Literal('done')])),
          dueDate: t.Optional(t.Any())
        })
      })
      .put('/:id', ({ params, body, set }) => {
        try {
          return taskService.updateTask(Number(params.id), body as any);
        } catch (e: any) {
          set.status = e.message === 'Task not found' ? 404 : 400;
          return { error: e.message };
        }
      }, {
        body: t.Object({
          title: t.Optional(t.String()),
          status: t.Optional(t.Union([t.Literal('todo'), t.Literal('doing'), t.Literal('done')])),
          dueDate: t.Optional(t.Any())
        })
      })

      .delete('/:id', ({ params, set }) => {
        try {
          return taskService.deleteTask(Number(params.id));
        } catch (e: any) {
          set.status = 404;
          return { error: e.message };
        }
      })
  )
  .get('/projects/:id/tasks', ({ params }) => taskService.listTasks(Number(params.id)));
