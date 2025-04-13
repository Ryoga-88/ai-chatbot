export const DEFAULT_CHAT_MODEL: string = 'chat-model';

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Chat model',
    description: 'あらゆる用途に対応するメインチャットモデルです。',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: '高度な推論能力を活用したチャットモデルです。',
  },
  {
    id: 'generate-voice',
    name: 'Voice model',
    description: 'あらゆるキャラクターや抑揚で音声生成するモデルです。',
  },
];
