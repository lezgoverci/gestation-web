import Image from "next/image";
import { useState, useEffect } from "react";
import CommentsForm from "./comments-form";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedComment, setSelectedComment] = useState<any | null>(null);

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
      <CommentsForm onUploadComplete={fetchComments} />
      {/* <section className="grid-gallery mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      </section> */}
      <section className="grid-gallery mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-md p-4 flex space-x-4"
          >
            <Image
              width={100}
              height={100}
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${comment.attributes.photos.data[0].attributes.url}`}
              alt=""
              onClick={() =>
                // setSelectedImage(
                //   `${process.env.NEXT_PUBLIC_STRAPI_URL}${comment.attributes.photos.data[0].attributes.url}`
                // )
                setSelectedComment(comment)
              }
              className="cursor-pointer"
            />
            <div>
              <h3 className="font-bold text-lg text-black">
                {comment.attributes.from}
              </h3>
              <p className="text-black">{comment.attributes.content}</p>
            </div>
          </div>
        ))}

        {/* {selectedImage && (
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
        )} */}

        {selectedComment && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">

                <div className="relative">
                  <img
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${selectedComment.attributes.photos.data[currentImageIndex].attributes.url}`}
                  />
                  <div className="flex justify-between">
                    <button
                      className="text-black"
                      onClick={() =>
                        setCurrentImageIndex(
                          (currentImageIndex -
                            1 +
                            selectedComment.attributes.photos.data.length) %
                            selectedComment.attributes.photos.data.length
                        )
                      }
                    >
                      Previous
                    </button>
                    <button
                      className="text-black"
                      onClick={() =>
                        setCurrentImageIndex(
                          (currentImageIndex + 1) %
                            selectedComment.attributes.photos.data.length
                        )
                      }
                    >
                      Next
                    </button>
                  </div>
                  <button
                    className="absolute top-0 right-0 p-2 text-black"
                    onClick={() => {
                      setSelectedComment(null);
                      setCurrentImageIndex(0);
                    }}
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
