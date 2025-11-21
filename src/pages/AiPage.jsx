import React, { useState, useEffect, useCallback, useMemo } from "react";

// --- Configuration ---
const BASE_URL = "http://localhost:5000/api";
const MOCK_USER_ID = "user-abc-123";
const API_KEY = ""; // Placeholder for Canvas environment

// --- Utility Functions (Simulating Axios and API calls) ---

/**
 * Custom hook to handle API fetching with loading and error states.
 */
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (endpoint, method = "GET", data = null, isFileUpload = false) => {
      setLoading(true);
      setError(null);
      let result = null;

      const url = `${BASE_URL}${endpoint}`;
      const headers = {};
      let body;

      try {
        if (isFileUpload) {
          // For file upload, data should be a FormData object
          body = data;
          // Do NOT set Content-Type header; fetch will handle it with FormData boundary
        } else {
          headers["Content-Type"] = "application/json";
          if (data) {
            body = JSON.stringify(data);
          }
        }

        const response = await fetch(url, {
          method,
          headers,
          body,
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(
            errData.error || `HTTP error! Status: ${response.status}`
          );
        }

        result = await response.json();
      } catch (err) {
        // --- FIX: Enhanced error handling for NetworkError ---
        let errorMessage = err.message;
        if (
          err.message.includes("NetworkError") ||
          err.message.includes("Failed to fetch")
        ) {
          errorMessage = `Connection Failed. Ensure the backend Express server is running on ${BASE_URL.replace(
            "/api",
            ""
          )} and that CORS is enabled.`;
        }
        setError(errorMessage);
        console.error("API Error:", err);
        // --- END FIX ---
      } finally {
        setLoading(false);
      }
      return result;
    },
    []
  );

  return { loading, error, fetchData };
};

// --- Shared Components ---

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    <span className="ml-3 text-indigo-700">Processing with AI...</span>
  </div>
);

const Card = ({ title, children, className = "" }) => (
  <div
    className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${className}`}
  >
    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
      {title}
    </h2>
    {children}
  </div>
);

// --- Pages/Features ---

/**
 * 1. AI Consumption Pattern Analyzer
 * 7. SDG Impact Scoring Engine
 */
const AnalyticsPage = ({ api, loading, error }) => {
  const [analysis, setAnalysis] = useState(null);
  const [sdgScore, setSdgScore] = useState(null);

  const fetchAnalysis = async () => {
    const result = await api.fetchData(
      "/analysis/analyze-consumption",
      "POST",
      {}
    );
    if (result && result.analysis) {
      setAnalysis(result.analysis);
    }
  };

  const fetchSDGScore = async () => {
    const result = await api.fetchData(
      "/analysis/calculate-sdg-score",
      "POST",
      {}
    );
    if (result && result.scoreData) {
      setSdgScore(result.scoreData);
    }
  };

  const renderHeatmap = (data) => {
    if (!data) return null;
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    if (total === 0)
      return <p className="text-gray-500">No consumption data to display.</p>;

    return (
      <div className="space-y-3">
        {Object.entries(data).map(([category, value]) => {
          const percentage = (value / total) * 100;
          const color =
            category === "Vegetable"
              ? "bg-green-500"
              : category === "Fruit"
              ? "bg-yellow-500"
              : category === "Protein"
              ? "bg-red-500"
              : "bg-gray-400";
          return (
            <div key={category} className="flex items-center text-sm">
              <span className="w-24 font-medium text-gray-600">{category}</span>
              <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`${color} h-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="ml-3 w-10 text-right text-gray-700">
                {Math.round(percentage)}%
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Data Analytics & Impact
      </h1>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={fetchAnalysis}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 shadow-md"
        >
          {loading && analysis === null
            ? "Analyzing..."
            : "Run Consumption Analyzer"}
        </button>
        <button
          onClick={fetchSDGScore}
          disabled={loading}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 shadow-md"
        >
          {loading && sdgScore === null
            ? "Calculating..."
            : "Calculate SDG Score"}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && (
        <p className="text-red-500 p-3 bg-red-50 border border-red-200 rounded-lg">
          Error: {error}
        </p>
      )}

      {/* SDG Score Card */}
      {sdgScore && (
        <Card title="Personal SDG Impact Score" className="bg-teal-50">
          <div className="flex flex-col items-center justify-center p-4">
            <div
              className={`text-6xl font-extrabold ${
                sdgScore.sdgScore >= 70
                  ? "text-green-600"
                  : sdgScore.sdgScore >= 40
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {Math.round(sdgScore.sdgScore)}
            </div>
            <p className="text-lg font-medium mt-2 text-gray-700">
              {sdgScore.weeklyInsight}
            </p>
            <p className="mt-4 p-3 border-l-4 border-teal-500 bg-teal-100 italic text-gray-700">
              <span className="font-semibold">Next Step:</span>{" "}
              {sdgScore.actionableNextStep}
            </p>
          </div>
        </Card>
      )}

      {/* Consumption Analysis Card */}
      {analysis && (
        <Card title="AI Consumption Analysis & Waste Prediction">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Category Heatmap (Consumption Balance)
              </h3>
              {renderHeatmap(analysis.heatmapData)}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Key Insights
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {analysis.weeklyTrends.map((trend, i) => (
                  <li key={`trend-${i}`}>{trend}</li>
                ))}
                {analysis.imbalances.map((imbalance, i) => (
                  <li
                    key={`imbalance-${i}`}
                    className="text-red-500 font-medium"
                  >
                    {imbalance} (FLAGGED)
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Waste Risk Prediction (3-7 Days)
            </h3>
            {analysis.wastePrediction.length > 0 ? (
              <ul className="space-y-2">
                {analysis.wastePrediction.map((item, i) => (
                  <li
                    key={`waste-${i}`}
                    className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <span className="font-semibold text-yellow-800">
                      {item.item}
                    </span>
                    <span className="text-sm text-yellow-700">
                      {item.reason}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-600 font-medium">
                No high-risk items predicted! Great job!
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

/**
 * 2. AI Meal Optimization Engine
 * 4. AI Expiration Risk Prediction (Integrated into Dashboard display)
 */
const DashboardPage = ({ api, loading, error }) => {
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [riskPrediction, setRiskPrediction] = useState(null);

  const runOptimization = async () => {
    const result = await api.fetchData(
      "/tracking/optimize-meal-plan",
      "POST",
      {}
    );
    if (result && result.optimizationResult) {
      setOptimizationResult(result.optimizationResult);
    }
  };

  const fetchRisk = async () => {
    const result = await api.fetchData(
      "/tracking/predict-expiry-risk",
      "POST",
      {}
    );
    if (result && result.prediction) {
      setRiskPrediction(result.prediction);
    }
  };

  useEffect(() => {
    // Fetch initial data on load
    fetchRisk();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Optimization Dashboard
      </h1>

      {/* Action Button */}
      <div className="flex space-x-4">
        <button
          onClick={runOptimization}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 shadow-md"
        >
          {loading && optimizationResult === null
            ? "Optimizing..."
            : "Generate Optimized Weekly Meal Plan"}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && (
        <p className="text-red-500 p-3 bg-red-50 border border-red-200 rounded-lg">
          Error: {error}
        </p>
      )}

      {/* Expiration Risk Prediction Card (Always visible) */}
      <Card title="Inventory Expiration Risk Score" className="bg-red-50">
        {riskPrediction ? (
          <div className="space-y-3">
            {riskPrediction.riskAnalysis.map((item) => (
              <div
                key={item.id}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  item.riskLevel === "High"
                    ? "bg-red-100 border-red-300"
                    : item.riskLevel === "Medium"
                    ? "bg-orange-100 border-orange-300"
                    : "bg-green-100 border-green-300"
                }`}
              >
                <span className="font-semibold">{item.item}</span>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      item.riskLevel === "High"
                        ? "bg-red-500 text-white"
                        : item.riskLevel === "Medium"
                        ? "bg-orange-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {item.riskLevel} Risk
                  </span>
                  <span className="text-sm text-gray-600">
                    Priority: {item.consumptionPriority}
                  </span>
                </div>
                <span className="text-xs italic text-gray-500">
                  {item.reason}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Click the 'Calculate SDG Score' button on the Analytics page to
            populate initial data.
          </p>
        )}
      </Card>

      {/* Meal Optimization Result */}
      {optimizationResult && (
        <Card title="Optimized 7-Day Meal Plan">
          <p className="mb-4 text-blue-700 font-medium">
            {optimizationResult.budgetSummary}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-medium mb-3">Meal Plan Details</h3>
              <div className="space-y-2">
                {optimizationResult.mealPlan.map((dayPlan, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <h4 className="font-bold text-indigo-700">{dayPlan.day}</h4>
                    <ul className="text-sm list-disc list-inside ml-2 text-gray-700">
                      <li>Breakfast: {dayPlan.breakfast}</li>
                      <li>Lunch: {dayPlan.lunch}</li>
                      <li>Dinner: {dayPlan.dinner}</li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1 border-l pl-4">
              <h3 className="text-lg font-medium mb-3">Shopping List</h3>
              <ul className="space-y-2">
                {optimizationResult.shoppingList.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b pb-1 text-sm text-gray-700"
                  >
                    <span>
                      {item.quantity} {item.item}
                    </span>
                    <span className="font-semibold text-green-600">
                      ${item.estimatedCost.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

/**
 * 3. OCR or Vision-Based Food Input
 */
const UploadPage = ({ api, loading, error }) => {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setExtractedData(null); // Clear previous results
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    // Pass true for isFileUpload to skip JSON header
    const result = await api.fetchData(
      "/upload/upload-inventory-vision",
      "POST",
      formData,
      true
    );

    if (result && result.extractedItems) {
      setExtractedData(result.extractedItems);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Vision-Based Inventory Input
      </h1>
      <Card title="Upload Receipt or Food Label">
        <p className="text-gray-600 mb-4">
          Use the Gemini Vision API to extract item names, quantities, and dates
          automatically.
        </p>

        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 shadow-md"
        >
          {loading ? "Analyzing Image..." : "Process with Vision AI"}
        </button>
      </Card>

      {loading && <LoadingSpinner />}
      {error && (
        <p className="text-red-500 p-3 bg-red-50 border border-red-200 rounded-lg">
          Error: {error}
        </p>
      )}

      {extractedData && (
        <Card title="Extracted Inventory Data (Requires Confirmation)">
          <p className="mb-4 text-sm text-gray-700">
            Review the items extracted by the AI. Items needing confirmation are
            flagged.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {extractedData.map((item, index) => (
                  <tr
                    key={index}
                    className={item.needsConfirmation ? "bg-yellow-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.expirationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.needsConfirmation ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Review Required
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Confirmed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

/**
 * 6. NourishBot – Multi-Capability Chatbot
 */
const ResourcesPage = ({ api, loading, error }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setInput("");

    // Add temporary loading message
    setChatHistory((h) => [...h, { role: "model", text: "..." }]);

    // Convert history for API (assuming the backend handles the mapping,
    // but we use the simple string array for display in the frontend)
    // The backend uses the full history structure: { role: "user/model", parts: [{ text: message }] }
    // We send only the last user message, relying on the backend's session storage.

    const data = {
      userId: MOCK_USER_ID,
      message: input.trim(),
    };

    const result = await api.fetchData(
      "/resources/nourishbot-chat",
      "POST",
      data
    );

    // Remove temporary loading message
    setChatHistory((h) => h.filter((msg) => msg.text !== "..."));

    if (result && result.response) {
      setChatHistory((h) => [...h, { role: "model", text: result.response }]);
    } else {
      setChatHistory((h) => [
        ...h,
        {
          role: "model",
          text: "Sorry, I couldn't connect to the AI. Please try again.",
        },
      ]);
    }
  };

  const ChatMessage = ({ role, text }) => (
    <div
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md ${
          role === "user"
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        }`}
      >
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 flex flex-col h-full">
      <h1 className="text-3xl font-bold text-gray-900">NourishBot Chat</h1>
      <Card
        title="Your AI Food Assistant"
        className="flex-grow flex flex-col h-96"
      >
        <div className="flex-grow overflow-y-auto p-2 space-y-2 mb-4 bg-white">
          <ChatMessage
            role="model"
            text="Hi there! I'm NourishBot. I can help you reduce food waste, plan budget meals, and get creative with leftovers. What can I help you with today?"
          />
          {chatHistory.map((msg, index) => (
            <ChatMessage key={index} role={msg.role} text={msg.text} />
          ))}
          {loading && api.loading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-xl bg-gray-100 rounded-tl-none">
                <LoadingSpinner />
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-xs text-center mb-2">
            Error: {error}
          </p>
        )}

        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask NourishBot..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            disabled={loading || api.loading}
          />
          <button
            type="submit"
            disabled={loading || api.loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 shadow-md flex items-center justify-center"
          >
            Send
          </button>
        </form>
      </Card>
    </div>
  );
};

// --- Layout and Main App ---

const NavItem = ({ page, currentPage, setCurrentPage, icon }) => (
  <button
    onClick={() => setCurrentPage(page)}
    className={`flex items-center space-x-3 p-3 rounded-lg w-full text-left transition-colors duration-150 ${
      currentPage === page
        ? "bg-indigo-700 text-white shadow-lg"
        : "text-indigo-200 hover:bg-indigo-700 hover:text-white"
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="font-medium">{page}</span>
  </button>
);

const MainLayout = ({ currentPage, setCurrentPage, children }) => (
  <div className="min-h-screen bg-gray-100 flex font-sans">
    {/* Sidebar */}
    <div className="w-64 bg-indigo-900 p-6 flex flex-col">
      <div className="text-3xl font-extrabold text-white mb-10">
        Nourish<span className="text-indigo-400">AI</span>
      </div>
      <div className="space-y-3 flex-grow">
        <NavItem
          page="Dashboard"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          icon="🏠"
        />
        <NavItem
          page="Analytics"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          icon="📊"
        />
        <NavItem
          page="Upload"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          icon="📷"
        />
        <NavItem
          page="NourishBot"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          icon="🤖"
        />
        <div className="pt-4 border-t border-indigo-700 mt-4">
          <p className="text-xs text-indigo-400">User ID: {MOCK_USER_ID}</p>
        </div>
      </div>
    </div>

    {/* Content Area */}
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">{children}</div>
    </main>
  </div>
);

// --- Main Application Component ---
const App = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const api = useApi();

  const renderPage = useMemo(() => {
    const pageProps = { api, loading: api.loading, error: api.error };

    switch (currentPage) {
      case "Dashboard":
        return <DashboardPage {...pageProps} />;
      case "Analytics":
        return <AnalyticsPage {...pageProps} />;
      case "Upload":
        return <UploadPage {...pageProps} />;
      case "NourishBot":
        // Chatbot needs full height, so we adjust MainLayout height on this page
        return (
          <div className="h-[calc(100vh-64px)]">
            <ResourcesPage {...pageProps} />
          </div>
        );
      default:
        return <DashboardPage {...pageProps} />;
    }
  }, [currentPage, api]);

  return (
    <MainLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage}
    </MainLayout>
  );
};

export default App;
