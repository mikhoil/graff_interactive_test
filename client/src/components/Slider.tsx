import { useEffect, useState } from 'react';
import { useWindowWidth } from '../hooks/useWindowWidth';

export function Slider() {
  const [images, setImages] = useState<{ filename: string }[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const width = useWindowWidth();

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:4000/images')
      .then<{ filename: string }[]>(response => {
        setIsLoading(false);
        return response.json();
      })
      .then(files => setImages(files));
  }, []);

  return isLoading ? (
    <div className="m-auto w-[100px] h-[100px] rounded-full border-t-[#B9D7FB] border-8 animate-spin duration-500" />
  ) : (
    <div className="flex-1 flex border-r relative z-10 border-r-[#EBECF2] overflow-hidden items-center">
      <div
        style={{
          transition: '1s',
          left: -currentImage * (width - 360),
        }}
        className={'absolute flex flex-1 py-6 -z-20 w-max h-max'}
        id="images"
      >
        {images.map(({ filename }) => (
          <img
            key={filename}
            loading="lazy"
            src={`http://localhost:4000/images/${filename}`}
            style={{
              transition: '1s',
            }}
            className="object-contain object-center max-h-[650px] hover:scale-105"
            alt={filename}
            width={width - 360}
          />
        ))}
      </div>
      <button
        className="absolute z-10 rounded-full p-[15px] left-16 bg-white hover:bg-[#EBECF2] active:bg-[#B9D7FB] max-[720px]:left-6 max-[600px]:left-3"
        onClick={() =>
          setCurrentImage(prev => (prev === 0 ? images.length - 1 : prev - 1))
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
          setCurrentImage(prev => (prev === images.length - 1 ? 0 : prev + 1))
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
