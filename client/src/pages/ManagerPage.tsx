import { useEffect, useRef, useState } from 'react';
import { ChatItem } from '../components/ChatItem';
import { SupportChat } from '../components/SupportChat';
import { IMessage } from '../types/Message';

export function ManagerPage() {
  const [currentChat, setCurrentChat] = useState<number>();
  const [chats, setChats] = useState<string[]>([]);
  const socket = useRef<WebSocket>();

  useEffect(() => {
    if (!socket.current || socket.current.readyState === WebSocket.CLOSED) {
      socket.current = new WebSocket('ws://localhost:4000/');

      socket.current.onmessage = event => {
        const newChat = JSON.parse(event.data) as Pick<IMessage, 'chatId'>;

        if (!('text' in newChat)) setChats(prev => [...prev, newChat.chatId]);
      };
    }
    return () => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN)
        socket.current.close();
    };
  }, []);

  useEffect(() => {
    fetch('http://localhost:4000/chats')
      .then(res => res.json())
      .then(data => {
        setChats(data);
      });
  }, []);

  return (
    <div className="flex flex-col h-dvh">
      <header className="py-4 pl-10 border-b border-b-[##EBECF2]">
        <h1 className="font-semibold text-2xl">graff.support</h1>
      </header>
      <main className="flex flex-1 overflow-hidden">
        {chats.length ? (
          <>
            <div className="max-w-[360px] border-r border-r-[#EBECF2]">
              {chats.map((_, index) => (
                <ChatItem
                  key={index}
                  selected={index === currentChat}
                  onClick={() => setCurrentChat(index)}
                />
              ))}
            </div>
            {currentChat !== undefined && (
              <SupportChat role="manager" chatId={chats[currentChat]} />
            )}
          </>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
}
