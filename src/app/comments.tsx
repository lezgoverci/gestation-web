import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Photo {
  url: string;
}

interface Comment {
  name: string;
  content: string;
  photos: Photo[];
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments?populate[0]=photos`
    );
    const data = await response.json();
    const reformattedComments = data.data.map((item: any) => ({
      name: item.attributes.from,
      content: item.attributes.content,
      photos: item.attributes.photos.data.map((photo: any) => ({
        url: photo.attributes.url,
      })),
    }));

    setComments(reformattedComments);
  };

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <div key={index} className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-xl font-bold text-black">{comment.name}</h2>
          <p className="text-gray-600">{comment.content}</p>
          {comment.photos &&
            comment.photos.map((photo, photoIndex) => (
              <Image
                key={index}
                width={200}
                height={200}
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${photo.url}`}
                alt=""
                style={{ cursor: "pointer" }}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default Comments;
