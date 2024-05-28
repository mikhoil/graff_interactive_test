import { useCallback, useEffect, useRef, useState } from 'react';
import { IMessage, Role } from '../types/Message';
import { MessageItem } from './MessageItem';

export function SupportChat({ role, chatId }: { role: Role; chatId: string }) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const socket = useRef<WebSocket>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket.current || socket.current.readyState === WebSocket.CLOSED) {
      socket.current = new WebSocket(`ws://localhost:4000/`);
      socket.current.onopen = () => {
        if (role === 'manager') {
          socket.current?.send(JSON.stringify({ chatId }));
        }
      };
      socket.current.onmessage = event => {
        const msg = JSON.parse(event.data) as IMessage;
        if ('text' in msg) setMessages(prev => [...prev, msg]);
      };
    }
    return () => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN)
        socket.current.close();
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:4000/messages/${chatId}`)
      .then<IMessage[]>(res => {
        setIsLoading(false);
        return res.json();
      })
      .then(data => setMessages(data));
  }, [chatId]);

  useEffect(() => {
    ref.current!.scrollTop = ref.current!.scrollHeight;
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (value) {
      if (role === 'user' || messages.length === 0) {
        socket.current?.send(JSON.stringify({ chatId }));
      }
      const message: Omit<IMessage, 'id'> = {
        role,
        text: value,
        chatId,
      };
      socket.current?.send(JSON.stringify(message));
      setValue('');
    }
  }, [value, role, messages.length, chatId]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Enter') sendMessage();
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [sendMessage]);

  return (
    <div
      className={
        'flex-1 flex flex-col' +
        (role === 'user' ? ' min-w-[360px] min-[720px]:max-w-[360px]' : '')
      }
    >
      {role === 'user' && (
        <h1 className="text-xl font-semibold p-4 border-b border-b-[#EBECF2]">
          Чат с поддержкой
        </h1>
      )}
      <div className="bg-[#F1F3F5] flex-1 overflow-auto flex flex-col justify-end">
        <div className=" flex flex-col p-4 overflow-auto" ref={ref}>
          {isLoading ? (
            <div className="m-auto w-[100px] h-[100px] rounded-full border-t-[#B9D7FB] border-8 animate-spin duration-500" />
          ) : (
            messages.map((msg, index) => (
              <MessageItem
                key={index}
                text={msg.text}
                isOwn={msg.role === role}
                isLast={
                  (index < messages.length - 1 &&
                    messages[index + 1].role !== msg.role) ||
                  index === messages.length - 1
                }
              />
            ))
          )}
        </div>
      </div>
      <div className="p-3 flex gap-x-3">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="flex-1 ml-1 placeholder-[#77828C] text-sm outline-none font-normal"
          placeholder="Написать сообщение..."
        />
        <button className="w-6 h-6" onClick={sendMessage}>
          <img
            src={
              value
                ? 'src/assets/activesend.svg'
                : 'src/assets/inactivesend.svg'
            }
            className="m-auto"
            alt="отправить"
          />
        </button>
      </div>
    </div>
  );
}
