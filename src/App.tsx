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
