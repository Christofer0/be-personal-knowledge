import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { projectController } from './controllers/project.controller';
import { taskController } from './controllers/task.controller';
import { noteController } from './controllers/note.controller';
import { tagController } from './controllers/tag.controller';
import { chartController } from './controllers/chart.controller';

const app = new Elysia()
  .use(swagger())
  .use(cors({
    origin: [
      'http://localhost:5173',
      /\.vercel\.app$/,
      /\.up\.railway\.app$/
    ]
  }))
  .get('/', () => {
    return {
      status: 'success',
      message: 'Personal Knowledge + Task Management API is running!',
      timestamp: new Date().toISOString(),
      docs: '/swagger'
    };
  })

  // 🔥 INI YANG BARU
  .group('/api', (app) =>
    app
      .use(projectController)
      .use(taskController)
      .use(noteController)
      .use(tagController)
      .use(chartController)
  )

  .onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { error: 'Route not found' };
    }

    set.status = 400;
    return { error: (error as any)?.message || 'Internal Server Error' };
  })

  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia berjalan di ${app.server?.hostname}:${app.server?.port}`
);