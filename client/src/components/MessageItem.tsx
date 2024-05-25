export function MessageItem({
  isOwn,
  text,
  isLast,
}: {
  text: string;
  isOwn: boolean;
  isLast: boolean;
}) {
  const bg = isOwn ? 'bg-[#B9D7FB]' : 'bg-[#E2EAF1]';

  return (
    <div className={'flex items-end ' + (isLast ? 'mb-4' : 'mb-1')}>
      <div
        className={
          'w-6 h-6 rounded-full text-[10px] font-semibold p-1 ' +
          bg +
          (!isLast ? ' opacity-0' : '')
        }
      >
        ИФ
      </div>
      {isLast && (
        <img
          src={isOwn ? 'src/assets/bluetail.svg' : 'src/assets/graytail.svg'}
          className="relative w-[7px] -left-[3.5px] -mr-[7px]"
          alt=""
        />
      )}
      <div
        className={
          'max-w-[360px] px-3 py-2 ml-[3.5px] text-sm font-normal text-wrap break-words flex-1 overflow-hidden ' +
          bg +
          (!isLast
            ? ' rounded-t-lg rounded-r-lg rounded-b rounded-br'
            : ' rounded-t-lg rounded-r-lg rounded-br-lg')
        }
      >
        {text}
      </div>
    </div>
  );
}
