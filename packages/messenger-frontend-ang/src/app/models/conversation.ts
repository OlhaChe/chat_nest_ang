import { Users } from './users';

export interface Conversation {
  conversationId: number;
  participants: Users[];
}
