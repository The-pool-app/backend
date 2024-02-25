import { messages } from '@prisma/client';
export interface ServertoClientEvents {
  createMessage: (payload: messages) => void;
  receiveMessage: (payload: messages) => void;
  getMessages: (payload: messages[]) => void;
  updateMessages: (payload: messages) => void;
  getUnreadMessages: (payload: messages[]) => void;
  getUnreadMessagesCount: (payload: number) => void;
}
