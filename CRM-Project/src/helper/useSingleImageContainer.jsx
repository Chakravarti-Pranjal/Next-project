import React, { useState } from "react";
import {
  Dropzone,
  FileMosaic,
  FullScreen,
  ImagePreview,
} from "@files-ui/react";

const useSingleImageContainer = () => {
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState("");

  const handleFilesChange = (incomingFile) => {
    console.log();

    setFile(incomingFile[0]);
    console.log("single-file", incomingFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSee = (file) => {
    setImgSrc(file);
  };

  const ImageContainer = () => {
    return (
      <>
        <Dropzone onChange={handleFilesChange} value={file} multiple={false}>
          {file && (
            <FileMosaic
              {...file}
              preview
              info
              onDelete={() => removeFile()}
              onSee={() => handleSee(file)}
              style={{ height: "5rem", display: "flex", alignItems: "center" }}
            />
          )}
        </Dropzone>

        {/* Full screen preview of the image */}
        <FullScreen open={imgSrc !== ""} onClose={() => setImgSrc("")}>
          <ImagePreview src={imgSrc} />
        </FullScreen>
      </>
    );
  };

  return {
    ImageContainer,
    file,
    setFile,
    handleFilesChange,
    removeFile,
  };
};

export default useSingleImageContainer;
