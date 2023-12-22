import Image from "next/image";
import { useState, useEffect } from "react";
import CommentsForm from "./comments-form";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  const fetchComments = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments?populate[0]=photos`
    );
    const data = await response.json();
    setComments(data.data);
  };

  useEffect(() => {

    fetchComments();
  }, []);

  return (
    <>
     <CommentsForm onUploadComplete={fetchComments}  />
    <section className="grid-gallery mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {comments.map((comment, index) => (
        <Image
          key={index}
          width={200}
          height={200}
          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${comment.attributes.photos.data[0].attributes.url}`}
          alt=""
          onClick={() =>
            setSelectedImage(
              `${process.env.NEXT_PUBLIC_STRAPI_URL}${comment.attributes.photos.data[0].attributes.url}`
            )
          }
          style={{ cursor: "pointer" }}
        />
      ))}

      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
          onClick={() => setSelectedImage(null)}
        >
          <Image
            src={selectedImage}
            alt="selected"
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}
    </section>
    </>
  );
}
