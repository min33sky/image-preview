import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

interface Props {
  imageSrc: string;
  onClose: () => void;
}

const ZOOM_INC = 1.1;

export default function ImagePreview({ imageSrc, onClose }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  const fitImageToScreen = () => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!image || !container) {
      return;
    }

    const containerBounds = container.getBoundingClientRect();
    const heightRatio = containerBounds.height / image.naturalHeight;
    const widthRatio = containerBounds.width / image.naturalWidth;

    setScale(Math.min(heightRatio, widthRatio, 1));
  };

  console.log('scale: ', scale);

  useEffect(() => {
    fitImageToScreen();
  }, []);

  const updateScale = (scale: number) => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!image || !container) {
      return;
    }

    // 이미지의 크기가 변경되기 전의 크기
    const prevWidth = image.width;
    const prevHeight = image.height;

    //? flushSync를 사용하면 즉시 DOM을 업데이트할 수 있다. (동기 방식)
    //? 기존 비동기 방식은 리액트가 업데이트를 모아서 처리하기 때문에
    //? DOM이 업데이트되기 전에 스크롤바를 중앙에 위치시킬 수 없다.
    flushSync(() => {
      setScale(scale);
    });

    // 위 코드로 DOM이 미리 업데이트 되었으므로 스크롤바를
    // 중앙에 위치시킬 수 있다.
    container.scrollBy({
      left: (image.width - prevWidth) / 2,
      top: (image.height - prevHeight) / 2,
    });
  };

  const handleZoomInClick = () => {
    updateScale(scale * ZOOM_INC);
  };

  const handleZoomOutClick = () => {
    updateScale(scale / ZOOM_INC);
  };

  const handleZoomResetClick = () => {
    fitImageToScreen();
  };

  // 이미지의 원본 크기
  const originalWidth = imageRef.current?.naturalWidth ?? 0;
  const originalHeight = imageRef.current?.naturalHeight ?? 0;

  // 보여줄 이미지의 크기
  const scaledDimensions = {
    width: scale * originalWidth,
    height: scale * originalHeight,
  };

  return (
    <div className="image-preview">
      <div className="top-bar">
        <button onClick={onClose} className="control">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div ref={containerRef} className="preview-container">
        <img
          ref={imageRef}
          src={imageSrc}
          alt=""
          style={scaledDimensions}
          className="preview-image"
        />
      </div>

      <div className="bottom-bar">
        <button
          aria-label="Zoom Out Button"
          onClick={handleZoomOutClick}
          className="control"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12h-15"
            />
          </svg>
        </button>

        <button
          aria-label="Reset Zoom Button"
          onClick={handleZoomResetClick}
          className="control control-with-padding"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          aria-label="Zoom In Button"
          onClick={handleZoomInClick}
          className="control"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
