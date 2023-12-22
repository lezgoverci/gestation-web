import { useState } from "react";

type CommentsFormProps = {
  onCommentSubmit?: () => void;
};

function CommentsForm({ onCommentSubmit }: CommentsFormProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({data:{ from: name, content: content }}),
      }
    );

    if (!response.ok) {
      console.error("Comment submission failed");
      return;
    }

    setName("");
    setContent("");

    if (onCommentSubmit) {
      onCommentSubmit();
    }
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
        placeholder="Content"
        className="w-full p-2 border border-gray-300 rounded-md text-black"
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Submit
      </button>
    </form>
  );
}

export default CommentsForm;
