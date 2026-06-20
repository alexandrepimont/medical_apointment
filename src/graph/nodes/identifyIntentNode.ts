import { getSystemPrompt, getUserPromptTemplate, IntentSchema} from '../../prompts/v1/identifyIntent.ts';
import { professionals } from '../../services/appointmentService.ts';
import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../graph.ts';

export function createIdentifyIntentNode(llmClient: OpenRouterService) {
  return async (state: GraphState): Promise<GraphState> => {
    console.log(`🔍 Identifying intent...`, llmClient);
    const input = state.messages.at(-1)!.text;
    try {
      const systemPrompt = getSystemPrompt(professionals);
      const userPrompt = getUserPromptTemplate(input);
      const result = await llmClient.generateStructured(
        systemPrompt,
        userPrompt,
        IntentSchema
      );

      return {
        ...state,
        intent: result?.intent ?? state.intent,
        professionalId: result?.professionalId ?? state.professionalId,
        professionalName: result?.professionalName ?? state.professionalName,
        datetime: result?.datetime ?? state.datetime,
        patientName: result?.patientName ?? state.patientName,
        reason: result?.reason ?? state.reason,
      };
    } catch (error) {
      console.error('❌ Error in identifyIntent node:', error);
      return {
        ...state,
        intent: 'unknown',
        error: error instanceof Error ? error.message : 'Intent identification failed',
      };
    }
  };
}
