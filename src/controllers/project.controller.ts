import { Elysia, t } from 'elysia';
import { ProjectService } from '../services/project.service';

const projectService = new ProjectService();

export const projectController = new Elysia({ prefix: '/projects' })
  .get('/', ({ query }) => projectService.listProjects(query.status as 'ongoing' | 'done'), {
    query: t.Optional(t.Object({
      status: t.Optional(t.String())
    }))
  })
  .get('/:id', ({ params, set }) => {
    try {
      return projectService.getProject(Number(params.id));
    } catch (e: any) {
      set.status = 404;
      return { error: e.message };
    }
  })
  .post('/', ({ body, set }) => {
    try {
      set.status = 201;
      return projectService.createProject(body as any);
    } catch (e: any) {
      set.status = 400;
      return { error: e.message };
    }
  }, {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
      status: t.Optional(t.Union([t.Literal('ongoing'), t.Literal('done')]))
    })
  })
  .put('/:id', ({ params, body, set }) => {
    try {
      return projectService.updateProject(Number(params.id), body as any);
    } catch (e: any) {
      set.status = e.message === 'Project not found' ? 404 : 400;
      return { error: e.message };
    }
  }, {
    body: t.Object({
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      status: t.Optional(t.Union([t.Literal('ongoing'), t.Literal('done')]))
    })
  })

  .delete('/:id', ({ params, set }) => {
    try {
      return projectService.deleteProject(Number(params.id));
    } catch (e: any) {
      set.status = 404;
      return { error: e.message };
    }
  });
