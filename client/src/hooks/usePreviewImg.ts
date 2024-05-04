import React, { useState } from "react";

const usePreviewImg = () => {
  const [previewImg, setPreviewImg] = useState<string>("");

  const handlePreviewImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const [file] = e.target.files;
    console.log(file.type);
    if (!file.type.startsWith("image")) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImg(e?.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  return { previewImg, handlePreviewImg };
};

export default usePreviewImg;
