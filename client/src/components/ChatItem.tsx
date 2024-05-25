import { MouseEventHandler } from 'react';

export function ChatItem({
  selected = false,
  onClick,
}: {
  selected?: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      onClick={onClick}
      className={
        'max-h-16 w-full p-3 flex gap-x-2 text-sm  ' +
        (selected ? 'bg-[#B9D7FB]' : 'hover:bg-[#EBECF2]')
      }
    >
      <div className="w-10 h-10 rounded-full text-center pt-2 font-semibold bg-[#f2f2f2]">
        ИФ
      </div>
      <div className="flex-1">
        <h3 className="font-semibold mb-0.5">Имя Фамилия</h3>
        <p className="max-w-72 text-[#777B8C] font-normal whitespace-nowrap overflow-hidden overflow-ellipsis">
          Сообщение и что с ним происходит, если оно не влезает
        </p>
      </div>
    </div>
  );
}
