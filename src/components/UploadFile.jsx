function UploadFile({ setFile }) {
  const handleFileChange = event => {
    const f = event.target.files[0];
    if (f) {
      setFile(f);
    }
  };
  return (
    <label className='bg-gray-200 w-[150px] my-5 py-5 m-auto mt-10 border-dashed border-black border-2 rounded-md flex place-items-center justify-center text-xl text-gray-400'>
      <input className='hidden' type='file' accept='audio/*' onChange={handleFileChange} /> Upload Audio
    </label>
  );
}

export default UploadFile;
