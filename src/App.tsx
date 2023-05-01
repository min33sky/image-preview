import { useState } from 'react';
import ImagePreview from './components/ImagePreview';
import { fileToDataString } from './utils';

function App() {
  const [previewImg, setPreviewImg] = useState<string>();

  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setPreviewImg(await fileToDataString(file));
    } catch (error) {
      console.error(error);
    } finally {
      //? 파일 선택창 초기화 (똑같은 파일 선택 가능하도록)
      e.target.value = '';
    }
  };

  const handleCloseClick = () => {
    setPreviewImg('');
  };

  return (
    <>
      <input type="file" onChange={handleChangeFile} accept="image/*" />
      {previewImg && (
        <ImagePreview imageSrc={previewImg} onClose={handleCloseClick} />
      )}
    </>
  );
}

export default App;
