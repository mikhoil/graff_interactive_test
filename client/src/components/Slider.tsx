import { useEffect, useRef, useState } from 'react';
import { useWindowWidth } from '../hooks/useWindowWidth';

export function Slider() {
  const [images, setImages] = useState<{ filename: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const width = useWindowWidth();
  const [sliderOffset, setSliderOffset] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:4000/images')
      .then<{ filename: string }[]>(response => {
        setIsLoading(false);
        return response.json();
      })
      .then(files => setImages(files));
  }, []);

  useEffect(() => {
    const imgs = Array.from(
      ref.current!.querySelectorAll('img'),
    ) as HTMLImageElement[];
    setSliderOffset(
      imgs.length
        ? (width - 360) / 2 - imgs[0].width - 16 - imgs[1].width / 2
        : 0,
    );
  }, [width, currentIndex]);

  return isLoading ? (
    <div className="m-auto w-[100px] h-[100px] rounded-full border-t-[#B9D7FB] border-8 animate-spin duration-500" />
  ) : (
    <div className="flex-1 flex border-r relative z-10 border-r-[#EBECF2] overflow-hidden items-center">
      <div
        style={{
          left: sliderOffset,
        }}
        className={'absolute flex flex-1 py-6 -z-20 w-max h-max gap-x-4'}
        ref={ref}
      >
        {images.length ? (
          [
            images[currentIndex === 0 ? images.length - 1 : currentIndex - 1],
            images[currentIndex],
            images[currentIndex === images.length - 1 ? 0 : currentIndex + 1],
          ].map(({ filename }) => (
            <img
              key={filename}
              src={`http://localhost:4000/images/${filename}`}
              style={{
                transition: '1s',
              }}
              className="object-contain object-center max-h-[650px]"
              alt={filename}
            />
          ))
        ) : (
          <></>
        )}
      </div>
      <button
        className="absolute z-10 rounded-full p-[15px] left-16 bg-white hover:bg-[#EBECF2] active:bg-[#B9D7FB] max-[720px]:left-6 max-[600px]:left-3"
        onClick={() =>
          setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
        }
      >
        <img
          className="w-5 h-5 max-[720px]:w-3 max-[720px]:h-3"
          src="src/assets/left.svg"
          alt="предыдущее изображение"
        />
      </button>
      <button
        className="absolute z-10 rounded-full p-[15px] right-16 bg-white hover:bg-[#EBECF2] active:bg-[#B9D7FB] max-[720px]:right-6 max-[600px]:right-3"
        onClick={() =>
          setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
        }
      >
        <img
          className="w-5 h-5 max-[720px]:w-3 max-[720px]:h-3"
          src="src/assets/right.svg"
          alt="следующее изображение"
        />
      </button>
    </div>
  );
}
