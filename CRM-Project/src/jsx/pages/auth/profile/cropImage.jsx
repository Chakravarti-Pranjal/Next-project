export default function getCroppedImg(imageSrc, pixelCrop) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous"; 
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
  
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
  
        const base64Image = canvas.toDataURL("image/jpeg");
        const base64Only = base64Image.replace(/^data:image\/jpeg;base64,/, "");
        resolve(base64Only);
      };
  
      image.onerror = (error) => reject(error);
    });
  }
  