import React from "react";

const CategoryFilter = ({ categories, active, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* ALL BUTTON */}
      <button
        onClick={() => onSelect("all")}
        className={`
          px-4 
          py-2 
          rounded-full 
          text-sm 
          font-medium
          transition-all
          duration-300
          border
          ${
            active === "all"
              ? "bg-green-600 text-white border-green-600 shadow-md"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }
        `}
      >
        All
      </button>

      {/* OTHER CATEGORIES */}
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`
            px-4 
            py-2 
            rounded-full 
            text-sm 
            font-medium
            transition-all
            duration-300
            border
            ${
              active === cat
                ? "bg-green-600 text-white border-green-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
