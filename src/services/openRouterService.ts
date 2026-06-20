import { ChatOpenAI } from '@langchain/openai';
import { config, type ModelConfig } from '../config.ts';
import { z } from 'zod/v3';
import { createAgent, HumanMessage, providerStrategy, SystemMessage } from 'langchain';

export class OpenRouterService {
    private config: ModelConfig;
    private llmClient: ChatOpenAI;

    constructor(configOverride?: ModelConfig) {
        this.config = configOverride ?? config;
        this.llmClient = new ChatOpenAI({
            apiKey: this.config.apiKey,
            modelName: this.config.models.at(0), // For simplicity, using the first model. Can implement routing logic based on config.provider.sort if needed.
            temperature: this.config.temperature,
            callbacks: [],
            configuration: {
                baseURL: 'https://openrouter.ai/api/v1',
                defaultHeaders: {
                    'HTTP-Referer': this.config.httpReferer,
                    'X-Title': this.config.xTitle,
                },
            },

            // conf from open router (smart model)
            modelKwargs: {
                model: this.config.models.at(0),
                provider: this.config.provider
            }
        })

    }
    async generateStructured<T>(
        systemPrompt: string,
        userPrompt: string,
        schema: z.ZodSchema<T>) {
        const agent = createAgent({
            model: this.llmClient,
            tools: [],
            responseFormat: providerStrategy(schema),
        });
        const messages = [
            new SystemMessage(systemPrompt),
            new HumanMessage(userPrompt),
        ];
        const data = await agent.invoke({ messages })
        };
        1;

}