import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ResourceCard from "../components/ResourceCard";
import CategoryFilter from "../components/CategoryFilter";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    try {
      const res = await api.get("/resources");
      const data = res.data;

      setResources(data);
      setFiltered(data);

      const cats = [...new Set(data.map((item) => item.category))];
      setCategories(cats);
    } catch (error) {
      console.error("Error fetching resources", error);
    }
  }

  const filterByCategory = (cat) => {
    setActiveCategory(cat);
    setFiltered(
      cat === "all" ? resources : resources.filter((r) => r.category === cat)
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900">
          Sustainable Food Resources
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Browse helpful articles, videos, and tips to reduce waste and improve
          food habits.
        </p>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onSelect={filterByCategory}
      />

      {/* Resources Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filtered.length > 0 ? (
          filtered.map((item) => <ResourceCard key={item._id} item={item} />)
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">
            No resources found in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Resources;
