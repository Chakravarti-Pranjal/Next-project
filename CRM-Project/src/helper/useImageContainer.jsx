import React, { useState } from "react";
import {
  Dropzone,
  FileMosaic,
  FullScreen,
  ImagePreview,
} from "@files-ui/react";
import { notifyHotError } from "./notify.jsx";

const useImageContainer = () => {
  const [multiFiles, setMultiFiles] = useState([]); // UI files for Dropzone
  const [multiImageData, setMultiImageData] = useState([]); // { name, path }
  const [viewFile, setViewFile] = useState(null);
  const [imgSrc, setImgSrc] = useState("");

  // 🔎 Prevent duplicates
  const isDuplicate = (file, files) => files.some((f) => f.name === file.name);

  // 🗑 Remove file
  const removeFile = (fileToRemove) => {
    setMultiFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileToRemove.name)
    );
    setMultiImageData((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileToRemove.name)
    );
  };

  // 👁 View file
  const handleViewFile = (file) => {
    setViewFile(file);
  };

  const handleSee = (data) => {
    setImgSrc(data.file);
  };

  // ✅ ImageContainer component
  const ImageContainer = () => {
    const handleFilesChange = (incomingFiles) => {
      const newFiles = Array.isArray(incomingFiles)
        ? incomingFiles
        : [incomingFiles];
      const validFiles = [];

      for (let f of newFiles) {
        const isImage = f?.file?.type?.startsWith("image/");
        if (!isImage || isDuplicate(f, multiFiles)) continue;

        validFiles.push(f);

        // store only name + object URL (path)

        const objectUrl = URL.createObjectURL(f.file);
        console.log(objectUrl, "objectUrl");

        const reader = new FileReader();
        reader.onload = () => {
          setMultiImageData((prev) => [
            ...prev,
            { name: f.name, imgString: reader.result }, // Base64 string
          ]);
        };
        reader.readAsDataURL(f.file);
      }

      setMultiFiles((prev) => [...prev, ...validFiles]);
    };
    console.log(multiFiles, multiImageData, "multiImageData");

    return (
      <>
        <Dropzone onChange={handleFilesChange} value={multiFiles} multiple>
          {multiFiles.map((file) => (
            <FileMosaic
              key={file.name}
              {...file}
              preview
              info
              onDelete={() => removeFile(file)}
              onClick={() => handleViewFile(file)}
              onSee={() => handleSee(file)}
              style={{ height: "5rem", display: "flex", alignItems: "center" }}
              cleanOnUpload={true}
            />
          ))}
        </Dropzone>
        <FullScreen open={imgSrc !== ""} onClose={() => setImgSrc("")}>
          <ImagePreview src={imgSrc} />
        </FullScreen>
      </>
    );
  };

  return {
    ImageContainer,
    multiFiles,
    setMultiFiles,
    removeFile,
    handleViewFile,
    multiImageData, // contains [{ name, path }]
    setMultiImageData,
  };
};

export default useImageContainer;
