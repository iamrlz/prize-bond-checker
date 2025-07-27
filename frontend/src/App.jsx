import React, { useState } from "react";

export default function App() {
  const [userFile, setUserFile] = useState(null);
  const [drawFile, setDrawFile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [totalUserBonds, setTotalUserBonds] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!userFile || !drawFile) {
      setError("⚠️ Please upload both files.");
      return;
    }
    setError("");
    setLoading(true);
    setMatches([]);
    setTotalUserBonds(0);

    const formData = new FormData();
    formData.append("userFile", userFile);
    formData.append("drawFile", drawFile);

    try {
      const res = await fetch("https://prizebond-checker-api.onrender.com/check-bonds", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Processing failed");

      setMatches(data.matches || []);
      setTotalUserBonds(data.totalUserBonds || 0);
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to process files. Please check formats.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 py-6 px-4 sm:py-10">
      <div className="max-w-xl sm:max-w-2xl lg:max-w-4xl mx-auto space-y-8 sm:space-y-10">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-indigo-600 leading-tight">
            🎯 Prize Bond Checker
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Upload your <strong>Bond List</strong> and <strong>Prize Draw</strong> files (TXT, Excel, PDF) to check results.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-6">

          {/* Your Bond List */}
          <div className="space-y-3">
            <label className="block font-medium text-blue-700 text-sm sm:text-base">
              📄 Your Bond List
              <span className="block text-xs sm:text-sm text-gray-500 font-normal mt-1">
                Accepted formats: .txt, .xlsx, .xls
              </span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".txt,.xlsx,.xls"
                onChange={(e) => setUserFile(e.target.files[0])}
                className="w-full text-sm p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:outline-none transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {userFile && (
              <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
                <span>✅</span>
                <span className="truncate">Selected: {userFile.name}</span>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">AND</span>
            </div>
          </div>

          {/* Prize Draw File */}
          <div className="space-y-3">
            <label className="block font-medium text-green-700 text-sm sm:text-base">
              🎫 Prize Bond Draw File
              <span className="block text-xs sm:text-sm text-gray-500 font-normal mt-1">
                Accepted formats: .pdf, .txt, .xlsx, .xls
              </span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".txt,.xlsx,.xls,.pdf"
                onChange={(e) => setDrawFile(e.target.files[0])}
                className="w-full text-sm p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 focus:border-green-500 focus:outline-none transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>
            {drawFile && (
              <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
                <span>✅</span>
                <span className="truncate">Selected: {drawFile.name}</span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Check Button */}
          <button
            onClick={handleCheck}
            disabled={loading}
            className="w-full py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>🔍 Checking...</span>
              </span>
            ) : (
              "✅ Check Results"
            )}
          </button>
        </div>

        {/* Results */}
        {totalUserBonds > 0 && (
          <div className="bg-white border border-gray-300 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm space-y-4 sm:space-y-6">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-green-700 mb-2">
                🎉 Results Summary
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">{matches.length}</div>
                    <div className="text-sm sm:text-base text-gray-600">Matched Bond{matches.length !== 1 ? "s" : ""}</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-600">{totalUserBonds}</div>
                    <div className="text-sm sm:text-base text-gray-600">Total Bonds</div>
                  </div>
                </div>
                {matches.length > 0 && (
                  <div className="mt-4 text-lg sm:text-xl font-semibold text-green-700">
                    Success Rate: {((matches.length / totalUserBonds) * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            </div>

            {matches.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
                  🏆 Winning Bonds
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 sm:max-h-80 overflow-y-auto">
                  <div className="grid gap-3">
                    {matches.map((m, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </div>
                          <span className="font-semibold text-gray-700 text-sm sm:text-base">
                            Bond #{m.bondNumber}
                          </span>
                        </div>
                        <span className="text-green-600 font-bold text-sm sm:text-base bg-green-50 px-3 py-1 rounded-full">
                          {m.prize}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl sm:text-6xl mb-4">😔</div>
                <p className="text-gray-500 text-base sm:text-lg">
                  No matching bonds found in your list.
                </p>
                <p className="text-gray-400 text-sm sm:text-base mt-2">
                  Better luck next time!
                </p>
              </div>
            )}
          </div>
        )}
        {/* Footer */}
        <footer className="text-center text-sm sm:text-base text-gray-500 mt-12 py-6 border-t border-gray-200">
          <div className="space-y-2">
            <p>
              Made with <span className="text-red-500 text-lg">❤️</span> by{" "}
              <a
                href="https://linktr.ee/iamrlz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors duration-200"
              >
                Zia Un Nabi Janjua
              </a>
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Secure • Fast • Reliable Prize Bond Checking
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
