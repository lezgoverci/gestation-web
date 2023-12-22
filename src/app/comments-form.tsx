import { useState } from "react";

function CommentsForm() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    // Upload the files
    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`files`, file);
    });

    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      console.error("File upload failed");
      return;
    }

    const uploadedFiles = await uploadResponse.json();

    // Save the URLs of the uploaded files to the /photos endpoint
    const photoUrls = uploadedFiles.map((file: { url: any }) => file.url);
    const photoPromises = photoUrls.map((url: any) =>
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/photos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {url:url},
        }),
      })
    );

    const photoResponses = await Promise.all(photoPromises);
    const failedResponses = photoResponses.filter((response) => !response.ok);

    if (failedResponses.length > 0) {
      console.error("Failed to save some photo URLs");
      return;
    }

    // Extract the photo IDs from the responses
    const photoData = await Promise.all(
      photoResponses.map((response) => response.json())
    );
    const photoIds = photoData.map((photo) => photo.data.id);

    // Create the comment
    const commentResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name,
            comment,
          },
        }),
      }
    );

    if (!commentResponse.ok) {
      console.error("Failed to create comment");
      return;
    }

    const createdComment = await commentResponse.json();


    const updateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments/${createdComment.data.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            photos: { connect: photoIds },
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      console.error("Failed to link photos to comment");
    } else {
      console.log("Linked photos to comment");
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    handleUpload();
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form mt-8">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Your comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*,video/*"
        className="upload-input"
        onChange={handleFileChange}
        multiple
      />
      <button type="submit" className="upload-button">
        Upload
      </button>
    </form>
  );
}

export default CommentsForm;
