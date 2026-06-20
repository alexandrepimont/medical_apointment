import { config } from '../config.ts';
import { OpenRouterService } from '../services/openRouterService.ts';
import { buildAppointmentGraph } from './graph.ts';

export function buildGraph() {
  const llmClient = new OpenRouterService();
  const appointmentService = new OpenRouterService();
  return buildAppointmentGraph(
    llmClient,
    appointmentService,
  );
}

export const graph = async () => {
  return buildGraph();
};
