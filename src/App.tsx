// src/App.tsx

import { Header } from "./components/Header";
import { FileUploader } from "./components/FileUploader";
import { CompressionControls } from "./components/CompressionControls";
import { useAppStore } from "./store/useAppStore";
import { useState } from "react";

function App() {
  const { errorMessage, metrics, compressedImageHex } = useAppStore();
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(null);

  // Convert hex string to blob and create URL for preview/download
  const handleCompressedImage = (hexString: string) => {
    const matches = hexString.match(/.{1,2}/g);
    const byteArray = new Uint8Array(
      matches ? matches.map(byte => parseInt(byte, 16)) : []
    );
    const blob = new Blob([byteArray], { type: 'image/png' });
    setCompressedImageUrl(URL.createObjectURL(blob));
  };

  // Listen for compressedImageHex in store
  if (compressedImageHex && !compressedImageUrl) {
    handleCompressedImage(compressedImageHex);
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Control Panel */}
        <div className="lg:col-span-1 bg-slate-800 rounded-lg p-6 shadow-lg h-fit space-y-6">
          <FileUploader />
          <CompressionControls />
        </div>

        {/* Right Side: Results Display */}
        <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-slate-200">Results</h2>
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-900 text-red-200 rounded">
              {errorMessage}
            </div>
          )}
          {/* Preview for compressed JPG/PNG */}
          {compressedImageUrl && (
            <div className="mt-4">
              <img src={compressedImageUrl} alt="Compressed Preview" className="max-w-xs rounded shadow" />
              {/* Show compressed image size if available */}
              {metrics?.compressed_size_bytes && (
                <p className="text-xs text-slate-400 mt-1">
                  Compressed size: {
                    metrics.compressed_size_bytes < 1024 * 1024
                      ? `${(metrics.compressed_size_bytes / 1024).toFixed(1)} KB`
                      : `${(metrics.compressed_size_bytes / (1024 * 1024)).toFixed(2)} MB`
                  }
                </p>
              )}
              <a href={compressedImageUrl} download="compressed_image.png" className="block mt-2 px-4 py-2 bg-green-600 text-white rounded font-bold text-center">Download Compressed Image</a>
            </div>
          )}
          {/* We will add the results components here in the next step */}
          <div className="mt-4 text-slate-400">
            The compression metrics and reconstructed image will appear here.
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;