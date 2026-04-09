import { ChartRepository } from '../repositories/chart.repository';

const repo = new ChartRepository();

export class ChartService {
  getActivity(days?: number) {
    return repo.getActivityByDay(days);
  }

  getTasksByStatus() {
    return repo.getTasksByStatus();
  }

  getNotesByType() {
    return repo.getNotesByType();
  }

  getProjectsOverview() {
    return repo.getProjectsOverview();
  }
}
