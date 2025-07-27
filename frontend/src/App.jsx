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
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-indigo-600">
            🎯 Prize Bond Checker
          </h1>
          <p className="text-gray-600 text-sm">
            Upload your <strong>Bond List</strong> and <strong>Prize Draw</strong> files (TXT, Excel, PDF) to check results.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow space-y-6">

          {/* Your Bond List */}
          <div className="space-y-2">
            <label className="block font-medium text-blue-700">
              📄 Your Bond List
              <span className="block text-sm text-gray-500">Accepted: .txt, .xlsx, .xls</span>
            </label>
            <input
              type="file"
              accept=".txt,.xlsx,.xls"
              onChange={(e) => setUserFile(e.target.files[0])}
              className="w-full text-sm"
            />
            {userFile && <p className="text-sm text-gray-500">Selected: {userFile.name}</p>}
          </div>

          {/* Separator */}
          <hr className="border-t border-gray-300 my-4" />

          {/* Prize Draw File */}
          <div className="space-y-2">
            <label className="block font-medium text-green-700">
              🎫 Prize Bond Draw File
              <span className="block text-sm text-gray-500">Accepted: .pdf, .txt, .xlsx, .xls</span>
            </label>
            <input
              type="file"
              accept=".txt,.xlsx,.xls,.pdf"
              onChange={(e) => setDrawFile(e.target.files[0])}
              className="w-full text-sm"
            />
            {drawFile && <p className="text-sm text-gray-500">Selected: {drawFile.name}</p>}
          </div>

          {/* Error */}
          {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

          {/* Check Button */}
          <button
            onClick={handleCheck}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition"
          >
            {loading ? "🔍 Checking..." : "✅ Check Results"}
          </button>
        </div>

        {/* Results */}
        {totalUserBonds > 0 && (
          <div className="bg-white border border-gray-300 rounded-xl p-5 shadow space-y-4">
            <h2 className="text-xl font-semibold text-center text-green-700">
              🎉 {matches.length} Matched Bond{matches.length !== 1 ? "s" : ""} out of {totalUserBonds}
            </h2>

            {matches.length > 0 ? (
              <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto text-sm">
                {matches.map((m, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <span className="font-semibold text-gray-700">Bond #{m.bondNumber}</span>
                    <span className="text-green-600 font-bold">{m.prize}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">❌ No matching bonds found in your list.</p>
            )}
          </div>
        )}
        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 mt-12">
          Made with <span className="text-red-500">❤️</span> by{" "}
          <a
            href="https://linktr.ee/iamrlz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline font-medium"
          >
            Zia Un Nabi Janjua
          </a>
        </footer>
      </div>
    </div>
  );
}
