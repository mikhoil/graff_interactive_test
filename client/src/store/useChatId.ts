import { v1 } from 'uuid';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useChatId = create<{ value: string }>()(
  devtools(
    persist(
      () => ({
        value: JSON.parse(localStorage.getItem('chatId') ?? '{}').state ?? v1(),
      }),
      {
        name: 'chatId',
        partialize: state => state.value,
      },
    ),
  ),
);
