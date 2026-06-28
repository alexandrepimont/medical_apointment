import { getSystemPrompt, getUserPromptTemplate, MessageSchema} from '../../prompts/v1/messageGenerator.ts';
import type { GraphState } from '../graph.ts';
import { AIMessage } from 'langchain';

export function createMessageGeneratorNode(llmClient: any) {
    return async (state: GraphState): Promise<Partial<GraphState>> => {
        console.log(`💬 Generating response message...`);

        try {
            const hasSucceeded = state.actionSuccess ? 'success' : 'error';
            const scenario = `${state.intent ?? 'unknown'}_${hasSucceeded}`;
            const details = {
                professionalName: state.professionalName,
                datetime: state.datetime,
                patientName: state.patientName,
                error: state.error,
            };
            const systemPromt = getSystemPrompt()
            const userPrompt = getUserPromptTemplate({ scenario, details });
            const result = await llmClient.generateStructured(systemPromt, userPrompt, MessageSchema);
            console.log(`✅ Response message generated: `, result.data?.message ?? result.data ?? result);
            if (result.error) {
                console.error(`❌ Error generating message: ${result.error}`);
                return {
                    messages: [
                        ...state.messages,
                        new AIMessage('An error occurred while generating the response message.')
                    ],
                };
            }
            const test = 2;
            console.log(`Test value: ${test}`);

            return {
                ...state,
                messages: [
                    ...state.messages,
                ],
            };
        } catch (error) {
            console.error('❌ Error in messageGenerator node:', error);
            return {
                ...state,
                messages: [
                    ...state.messages,
                    new AIMessage('An error occurred while processing your request.')
                ],
            };
        }
    };
}
