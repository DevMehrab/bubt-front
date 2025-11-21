import React from "react";

const ResourceCard = ({ item }) => {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer">
      <div
        className="
      group
      bg-white 
      p-5 
      rounded-2xl 
      shadow-sm 
      border 
      hover:shadow-md 
      hover:border-blue-400 
      transition-all 
      duration-300 
      cursor-pointer
    "
      >
        {/* Title */}
        <h2
          className="
        text-xl 
        font-semibold 
        text-gray-900 
        group-hover:text-blue-600 
        transition
      "
        >
          {item.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mt-3 leading-relaxed line-clamp-2">
          {item.description || "No description available"}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {item.category}
          </span>

          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {item.type}
          </span>
        </div>
      </div>
    </a>
  );
};

export default ResourceCard;
