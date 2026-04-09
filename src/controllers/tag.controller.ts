import { Elysia, t } from 'elysia';
import { TagService } from '../services/tag.service';

const tagService = new TagService();

export const tagController = new Elysia({ prefix: '/tags' })
  .get('/', () => tagService.listTags())
  .post('/', ({ body, set }) => {
    try {
      set.status = 201;
      return tagService.createTag(body);
    } catch (e: any) {
      set.status = 400;
      return { error: e.message };
    }
  }, {
    body: t.Object({
      name: t.String()
    })
  })
  .delete('/:id', ({ params, set }) => {
    try {
      return tagService.deleteTag(Number(params.id));
    } catch (e: any) {
      set.status = 404;
      return { error: e.message };
    }
  });
