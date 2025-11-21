import React from "react";
import { Link, BookOpen, Video, Zap, ExternalLink } from "lucide-react"; // Importing icons

// Function to determine a suitable icon based on resource type
const getIconForType = (type) => {
  switch (type?.toLowerCase()) {
    case "article":
    case "guide":
      return <BookOpen className="w-5 h-5" />;
    case "video":
      return <Video className="w-5 h-5" />;
    case "tool":
    case "app":
      return <Zap className="w-5 h-5" />;
    default:
      return <Link className="w-5 h-5" />;
  }
};

const ResourceCard = ({ item }) => {
  // Determine icon and color based on the resource type
  const IconComponent = getIconForType(item.type);
  const iconColorClass = "text-green-600 group-hover:text-green-700";
  const typeTagClass = "bg-green-100 text-green-700";

  return (
    // The anchor tag wraps the whole card for a large clickable area
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full" // Ensure the link occupies the full height
    >
      <div
        className="
          group
          bg-white 
          p-6 
          rounded-xl 
          shadow-lg 
          border border-gray-100
          hover:shadow-2xl 
          hover:border-green-500 
          transition-all 
          duration-300 
          cursor-pointer
          h-full 
          flex flex-col // Use flex to push the footer/tags to the bottom
          transform hover:-translate-y-1 // Added slight lift on hover
        "
      >
        {/* Icon/Visual Indicator */}
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full ${iconColorClass} bg-green-50 mb-4 transition-colors`}
        >
          {IconComponent}
        </div>

        {/* Title */}
        <h2
          className="
            text-xl 
            font-extrabold 
            text-gray-900 
            group-hover:text-green-700 
            transition 
            line-clamp-2 // Ensure title doesn't break the layout
          "
        >
          {item.title}
        </h2>

        {/* Description */}
        <p className="text-gray-500 mt-2 text-sm leading-relaxed line-clamp-3 flex-grow">
          {/* flex-grow allows description to take up available space */}
          {item.description ||
            "Helpful guide or information related to sustainable living and waste reduction."}
        </p>

        {/* --- Tags and Action Footer --- */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Tag */}
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full capitalize">
              {item.category}
            </span>

            {/* Type Tag */}
            <span
              className={`px-3 py-1 ${typeTagClass} text-xs font-medium rounded-full capitalize`}
            >
              {item.type || "Link"}
            </span>
          </div>

          {/* Read More Link (for visual cue) */}
          <div className="mt-3 flex items-center text-sm font-semibold text-green-600 group-hover:text-green-800 transition">
            View Resource
            <ExternalLink className="w-4 h-4 ml-1.5" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default ResourceCard;
