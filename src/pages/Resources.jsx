import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ResourceCard from "../components/ResourceCard";
import CategoryFilter from "../components/CategoryFilter";
import { Leaf, Search, Filter } from "lucide-react"; // Imported 'Filter' icon

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    // Apply filtering and search whenever resources, activeCategory, or searchTerm changes
    applyFilterAndSearch();
  }, [resources, activeCategory, searchTerm]); // Depend on resources, activeCategory, and searchTerm

  async function fetchResources() {
    try {
      const res = await api.get("/resources");
      const data = res.data;

      setResources(data);

      const cats = [...new Set(data.map((item) => item.category))].filter(
        Boolean
      );
      setCategories(cats);
    } catch (error) {
      console.error("Error fetching resources", error);
    }
  }

  const applyFilterAndSearch = () => {
    let result = resources;

    // 1. Filter by Category
    if (activeCategory !== "all") {
      result = result.filter((r) => r.category === activeCategory);
    }

    // 2. Filter by Search Term (case-insensitive on title/description)
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(lowerCaseSearch) ||
          r.description.toLowerCase().includes(lowerCaseSearch)
      );
    }

    setFiltered(result);
  };

  const filterByCategory = (cat) => {
    setActiveCategory(cat);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      {" "}
      {/* Increased max-width and padding */}
      {/* --- Header Section --- */}
      <div className="mb-14 text-center">
        {" "}
        {/* Increased bottom margin */}
        <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center">
          <Leaf className="w-12 h-12 text-green-500 mr-4 animate-bounce-slow" />{" "}
          {/* Larger icon with subtle animation */}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
            Resources
          </span>
        </h1>
      </div>
      <hr className="mb-10 border-gray-200" />
      {/* --- Filter & Search Bar Section --- */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-inner mb-12">
        {" "}
        {/* Background and shadow for filter area */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Search Input */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources by title or content..."
              className="w-full pl-12 pr-4 py-3 border-2 border-green-200 bg-white rounded-xl shadow-md focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter Component */}
          <div className="w-full md:w-2/3 flex flex-col sm:flex-row items-center">
            <Filter className="w-5 h-5 text-green-600 mr-3 hidden sm:block flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700 mr-4 hidden sm:block">
              FILTER BY:
            </span>
            <div className="w-full">
              <CategoryFilter
                categories={categories}
                active={activeCategory}
                onSelect={filterByCategory}
              />
            </div>
          </div>
        </div>
      </div>
      {/* --- Resources Grid Section --- */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-green-500 pl-4">
        {activeCategory === "all"
          ? `All Resources (${filtered.length})`
          : `${activeCategory} Guides (${filtered.length})`}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {" "}
        {/* Increased gap for more breathing room */}
        {filtered.length > 0 ? (
          filtered.map((item) => <ResourceCard key={item._id} item={item} />)
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 shadow-inner">
            {" "}
            {/* Enhanced empty state */}
            <p className="text-gray-500 text-xl font-medium">
              😔 No resources found matching "
              <span className="font-bold text-gray-700">{searchTerm}</span>"
              {activeCategory !== "all" && ` in the ${activeCategory} category`}
              .
            </p>
            <p className="text-gray-400 mt-2">
              Please clear the search or choose a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
