import { Elysia, t } from 'elysia';
import { ChartService } from '../services/chart.service';

const chartService = new ChartService();

export const chartController = new Elysia({ prefix: '/charts' })
  .get(
    '/activity',
    ({ query }) => chartService.getActivity(query.days ? Number(query.days) : undefined),
    {
      query: t.Optional(t.Object({
        days: t.Optional(t.String({ description: 'Jumlah hari ke belakang (default: 30)' })),
      })),
      detail: { summary: 'Aktivitas harian (tasks & notes dibuat per hari)' },
    }
  )
  .get('/tasks-by-status', () => chartService.getTasksByStatus(), {
    detail: { summary: 'Distribusi task berdasarkan status (todo/doing/done)' },
  })
  .get('/notes-by-type', () => chartService.getNotesByType(), {
    detail: { summary: 'Distribusi note berdasarkan tipe (snippet/error/note)' },
  })
  .get('/projects-overview', () => chartService.getProjectsOverview(), {
    detail: { summary: 'Ringkasan per project: jumlah task per status & total notes' },
  });
