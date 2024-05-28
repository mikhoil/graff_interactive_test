export type Role = 'user' | 'manager';
export interface IMessage {
  text: string;
  role: Role;
  chatId: string;
  id: string;
}
