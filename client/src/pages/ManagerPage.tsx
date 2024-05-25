import { useState } from 'react';
import { ChatItem } from '../components/ChatItem';
import { SupportChat } from '../components/SupportChat';

export function ManagerPage() {
  const [currentChat, setCurrentChat] = useState(0);

  return (
    <div className="flex flex-col h-dvh">
      <header className="py-4 pl-10 border-b border-b-[##EBECF2]">
        <h1 className="font-semibold text-2xl">graff.support</h1>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="max-w-[360px] border-r border-r-[#EBECF2]">
          {Array.from({ length: 10 }).map((_, index) => (
            <ChatItem
              key={index}
              selected={index === currentChat}
              onClick={() => setCurrentChat(index)}
            />
          ))}
        </div>
        <SupportChat role="manager" />
      </main>
    </div>
  );
}
