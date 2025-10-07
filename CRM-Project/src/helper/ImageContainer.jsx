import React, { useState, useCallback } from "react";
import {
  Dropzone,
  FileMosaic,
  FullScreen,
  ImagePreview,
} from "@files-ui/react";

const ImageContainer = ({ onFilesChange, existingFiles = [] }) => {
  const [viewFile, setViewFile] = useState(null);
  const [imgSrc, setImgSrc] = useState("");

  const handleSee = (data) => {
    setImgSrc(data.file);
  };

  const removeFile = (fileToRemove) => {
    onFilesChange(
      existingFiles.filter((file) => file.name !== fileToRemove.name)
    );
  };

  const handleViewFile = (file) => {
    setViewFile(file);
  };

  return (
    <>
      <Dropzone onChange={onFilesChange} value={existingFiles} multiple>
        {existingFiles.map((file) => (
          <FileMosaic
            key={file.name}
            {...file}
            preview
            info
            onDelete={() => removeFile(file)}
            onClick={() => handleViewFile(file)}
            onSee={() => handleSee(file)}
            style={{ height: "5rem", display: "flex", alignItems: "center" }}
          />
        ))}
      </Dropzone>
      <FullScreen open={imgSrc !== ""} onClose={() => setImgSrc("")}>
        <ImagePreview src={imgSrc} />
      </FullScreen>
    </>
  );
};

export default React.memo(ImageContainer);
