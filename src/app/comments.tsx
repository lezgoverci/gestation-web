import React, { useEffect, useState } from "react";

interface Photo {
  url: string;
}

interface Comment {
  name: string;
  content: string;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments`
    );
    const data = await response.json();
    const reformattedComments = data.data.map((item: any) => ({
        name: item.attributes.from,
        content: item.attributes.content,
      }));

      setComments(reformattedComments);
  };

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <div key={index} className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-xl font-bold text-black">{comment.name}</h2>
          <p className="text-gray-600">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Comments;
