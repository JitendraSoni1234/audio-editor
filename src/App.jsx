import { useState } from 'react';
import Header from './components/Header';
import MusicPlayer from './components/MusicPlayer';
import UploadFile from './components/UploadFile';
function App() {
  const [file, setFile] = useState(null);

  return (
    <>
      <Header />
      {file ? <MusicPlayer file={file} /> : <UploadFile setFile={setFile} />}
    </>
  );
}

export default App;
