import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PhotoAttributes {
  url: string;
}

interface Photo {
  id: string;
  type: string;
  attributes: PhotoAttributes;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchPhotos = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/photos`);
    const data = await response.json();
    setPhotos(data.data);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <section className="grid-gallery mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <Image
          key={index}
          width={200}
          height={200}
          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${photo.attributes.url}`}
          alt=""
          onClick={() =>
            setSelectedImage(`${process.env.NEXT_PUBLIC_STRAPI_URL}${photo.attributes.url}`)
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
          <Image src={selectedImage} alt="" layout="fill" objectFit="contain" />
        </div>
      )}
    </section>
  );
};

export default Gallery;