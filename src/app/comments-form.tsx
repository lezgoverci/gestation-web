import { useState } from "react";

type CommentsFormProps = {
  onCommentSubmit?: () => void;
};

function CommentsForm({ onCommentSubmit }: CommentsFormProps) {
  const [name, setName] = useState<
    string | number | readonly string[] | undefined
  >("");
  const [content, setContent] = useState<
    string | number | readonly string[] | undefined
  >("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    const uploadedPhoto = await handleUpload();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { from: name, content: content } }),
      }
    );

    if (!response.ok) {
      console.error("Comment submission failed");
      setIsLoading(false);
      return;
    }

    if (response.ok) {
      if (selectedFile) {
        const connectResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments/${
            (
              await response.json()
            ).data.id
          }`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: { photos: { connect: [uploadedPhoto.data.id] } },
            }),
          }
        );

        if (!connectResponse.ok) {
          console.error("photo connect failed");
          setIsLoading(false);
          return;
        }
      }
    }

    setName("");
    setContent("");

    if (onCommentSubmit) {
      onCommentSubmit();
    }

    setIsLoading(false);
  };

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

    const uploadedPhoto = await addResponse.json();

    return uploadedPhoto;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 my-4">
      <h2 className="text-2xl font-bold">Comments</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full p-2 border border-gray-300 rounded-md text-black"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Comment"
        className="w-full p-2 border border-gray-300 rounded-md text-black"
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}

export default CommentsForm;
