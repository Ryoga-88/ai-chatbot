import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { openai } from "@ai-sdk/openai";
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
        'generate-voice': chatModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openai("gpt-4-turbo"),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai("gpt-4"),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openai("gpt-3.5-turbo"),
        'artifact-model': openai("gpt-3.5-turbo"),
        'generate-voice': openai("gpt-4o-mini"),
      },
      imageModels: {
        'small-model': openai.image("dall-e-3"),
      },
    });
