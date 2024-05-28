import { Slider } from '../components/Slider';
import { SupportChat } from '../components/SupportChat';
import { useChatId } from '../store/useChatId';

export function UserPage() {
  const { value } = useChatId();

  return (
    <div className="flex flex-col h-dvh justify-stretch">
      <header className="py-4 pl-10 border-b border-b-[##EBECF2]">
        <h1 className="font-semibold text-2xl">graff.test</h1>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <Slider />
        <SupportChat role="user" chatId={value} />
      </main>
    </div>
  );
}
