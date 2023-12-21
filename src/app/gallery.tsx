import Image from 'next/image';
import { useState } from 'react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const thumbnails = [
    // Replace with your actual image URLs
    '/images/image1.png',
    '/images/image2.png',
    '/images/image3.png',
    '/images/image4.png',
    '/images/image5.png',
    '/images/image6.png',
  ];

  return (
    <section className="grid-gallery mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {thumbnails.map((thumbnail, index) => (
        <div key={index} onClick={() => setSelectedImage(thumbnail)}>
          <Image
            src={thumbnail}
            alt="thumbnail"
            width={500}
            height={300}
          />
        </div>
      ))}

{selectedImage && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    }}
    onClick={() => setSelectedImage(null)}
  >
    <Image src={selectedImage} alt="selected" layout="fill" objectFit="contain" />
  </div>
)}
    </section>
  );
}