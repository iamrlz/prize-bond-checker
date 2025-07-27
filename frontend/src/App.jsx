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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 text-neutral-900 py-6 sm:py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8 sm:space-y-10">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl sm:text-3xl">🎯</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 bg-clip-text text-transparent">
            Prize Bond Checker
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Upload your <strong className="text-primary-600">Bond List</strong> and <strong className="text-accent-600">Prize Draw</strong> files to check results instantly
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary-500/10 space-y-6 sm:space-y-8">

          {/* Your Bond List */}
          <div className="space-y-3">
            <label className="block font-semibold text-primary-700 text-sm sm:text-base">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📄</span>
                <span>Your Bond List</span>
              </div>
              <span className="block text-xs sm:text-sm text-neutral-500 font-normal">Accepted formats: .txt, .xlsx, .xls</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".txt,.xlsx,.xls"
                onChange={(e) => setUserFile(e.target.files[0])}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 
                         file:rounded-full file:border-0 file:text-sm file:font-medium
                         file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100
                         file:transition-colors cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
              />
            </div>
            {userFile && (
              <div className="flex items-center gap-2 p-3 bg-success-50 border border-success-200 rounded-lg">
                <span className="text-success-600 text-sm">✓</span>
                <p className="text-sm text-success-700 font-medium">{userFile.name}</p>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-neutral-400 font-medium">AND</span>
            </div>
          </div>

          {/* Prize Draw File */}
          <div className="space-y-3">
            <label className="block font-semibold text-accent-700 text-sm sm:text-base">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎫</span>
                <span>Prize Bond Draw File</span>
              </div>
              <span className="block text-xs sm:text-sm text-neutral-500 font-normal">Accepted formats: .pdf, .txt, .xlsx, .xls</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".txt,.xlsx,.xls,.pdf"
                onChange={(e) => setDrawFile(e.target.files[0])}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 
                         file:rounded-full file:border-0 file:text-sm file:font-medium
                         file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100
                         file:transition-colors cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 rounded-lg"
              />
            </div>
            {drawFile && (
              <div className="flex items-center gap-2 p-3 bg-success-50 border border-success-200 rounded-lg">
                <span className="text-success-600 text-sm">✓</span>
                <p className="text-sm text-success-700 font-medium">{drawFile.name}</p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-danger-50 border border-danger-200 rounded-xl">
              <span className="text-danger-600 text-lg">⚠️</span>
              <div className="text-danger-700 text-sm font-medium">{error}</div>
            </div>
          )}

          {/* Check Button */}
          <button
            onClick={handleCheck}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-accent-600 
                     hover:from-primary-700 hover:to-accent-700 
                     disabled:from-neutral-400 disabled:to-neutral-500
                     text-white font-semibold rounded-xl sm:rounded-2xl 
                     transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg
                     disabled:transform-none disabled:hover:scale-100
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                     text-sm sm:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Checking Results...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>✨</span>
                <span>Check Results</span>
              </div>
            )}
          </button>
        </div>

        {/* Results */}
        {totalUserBonds > 0 && (
          <div className="bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-success-500/10 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-success-500 to-primary-500 rounded-2xl mb-2">
                <span className="text-xl sm:text-2xl">🎉</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-success-600 to-primary-600 bg-clip-text text-transparent">
                {matches.length} Matched Bond{matches.length !== 1 ? "s" : ""} Found!
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base">
                Out of <span className="font-semibold text-neutral-800">{totalUserBonds}</span> bonds checked
              </p>
            </div>

            {matches.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">Your Winning Bonds:</h3>
                <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                  {matches.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-success-50 to-primary-50 border border-success-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                        <span className="font-semibold text-neutral-800">Bond #{m.bondNumber}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-success-700 font-bold text-lg">{m.prize}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <div className="text-4xl sm:text-5xl opacity-50">🔍</div>
                <p className="text-neutral-600 text-sm sm:text-base">No matching bonds found in your list</p>
                <p className="text-xs text-neutral-500">Better luck next time!</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs sm:text-sm text-neutral-500 mt-12 sm:mt-16 space-y-2">
          <div className="flex items-center justify-center gap-1">
            <span>Made with</span>
            <span className="text-danger-500 animate-pulse">❤️</span>
            <span>by</span>
            <a
              href="https://linktr.ee/iamrlz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-accent-600 font-medium transition-colors hover:underline"
            >
              Zia Un Nabi Janjua
            </a>
          </div>
          <div className="text-xs text-neutral-400">
            🔒 Your files are processed securely and never stored
          </div>
        </footer>
      </div>
    </div>
  );
}
