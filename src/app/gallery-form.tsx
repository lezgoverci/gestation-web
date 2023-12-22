import { useState } from "react";

const GalleryForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("files", selectedFile);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      console.error("File upload failed");
      return;
    }

    const uploadedFile = await response.json();

    console.log(uploadedFile);

    const addResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/photos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { url: uploadedFile[0].url } }),
      }
    );

    if (!addResponse.ok) {
      console.error("Adding photo failed");
      return;
    }

    setSelectedFile(null);
  };

  return (
    <form className="space-y-4 my-4">
        <h2 className="text-2xl font-bold">Gallery</h2>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <button
        type="button"
        onClick={handleUpload}
        className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Upload
      </button>
    </form>
  );
};

export default GalleryForm;
