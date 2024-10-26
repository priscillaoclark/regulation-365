import React from "react";
import { Post } from "../lib/posts";

interface CarouselProps {
  posts: Post[];
}

const Carousel: React.FC<CarouselProps> = ({ posts }) => {
  if (posts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-lg shadow-md overflow-hidden text-center p-6"
        >
          <img
            src={post.feature_image ?? "/default-image.jpg"}
            alt={post.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {post.title}
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default Carousel;
