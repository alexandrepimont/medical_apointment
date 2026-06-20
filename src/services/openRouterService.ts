import { ChatOpenAI } from '@langchain/openai';
import { config, ModelConfig } from '../config.ts';

export class OpenRouterService {
    private config: ModelConfig;
    private llmClient: ChatOpenAI;
    constructor(configOverride?: ModelConfig) {
        this.config = configOverride ?? config;
        this.llmClient = new ChatOpenAI({
            apiKey: this.config.apiKey,
            modelName: this.config.models.at(0), // For simplicity, using the first model. Can implement routing logic based on config.provider.sort if needed.
            temperature: this.config.temperature,
            configuration: {
                baseURL: 'https://openrouter.ai/api/v1',
                defaultHeaders: {
                    'HTTP-Referer': this.config.httpReferer,
                    'X-Title': this.config.xTitle,
                },
            },
        });
    }

}