// src/App.tsx

import { Header } from "./components/Header";
import { FileUploader } from "./components/FileUploader";
import { CompressionControls } from "./components/CompressionControls";
import { useAppStore } from "./store/useAppStore";
import { useState } from "react";

function App() {
  const { errorMessage, metrics, compressedImageHex, imageFile } = useAppStore();
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
          {compressedImageUrl && metrics && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Compressed Image</h3>
                <img src={compressedImageUrl} alt="Compressed Preview" className="w-full max-w-sm rounded shadow" />
                <a href={compressedImageUrl} download="compressed_image.png" className="block mt-3 px-4 py-2 bg-green-600 text-white rounded font-bold text-center">
                  Download Compressed Image
                </a>
              </div>
              
              {/* Compression Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Compression Details</h3>
                <div className="space-y-3 bg-slate-700 p-4 rounded">
                  {/* Original Size */}
                  {(metrics.original_size_bytes || imageFile) && (
                    <div className="flex justify-between">
                      <span className="text-slate-300">Original Size:</span>
                      <span className="text-slate-100 font-semibold">
                        {(() => {
                          const originalSize = metrics.original_size_bytes || imageFile?.size || 0;
                          return originalSize < 1024 * 1024
                            ? `${(originalSize / 1024).toFixed(1)} KB`
                            : `${(originalSize / (1024 * 1024)).toFixed(2)} MB`;
                        })()}
                      </span>
                    </div>
                  )}
                  
                  {/* Compressed Size */}
                  {metrics.compressed_size_bytes && (
                    <div className="flex justify-between">
                      <span className="text-slate-300">Compressed Size:</span>
                      <span className="text-slate-100 font-semibold">
                        {metrics.compressed_size_bytes < 1024 * 1024
                          ? `${(metrics.compressed_size_bytes / 1024).toFixed(1)} KB`
                          : `${(metrics.compressed_size_bytes / (1024 * 1024)).toFixed(2)} MB`
                        }
                      </span>
                    </div>
                  )}
                  
                  {/* Size Reduction */}
                  {(metrics.original_size_bytes || imageFile) && metrics.compressed_size_bytes && (
                    <div className="flex justify-between">
                      <span className="text-slate-300">Size Reduction:</span>
                      <span className="text-slate-100 font-semibold">
                        {(() => {
                          const originalSize = metrics.original_size_bytes || imageFile?.size || 0;
                          const reduction = originalSize - metrics.compressed_size_bytes;
                          return reduction < 1024 * 1024
                            ? `${(reduction / 1024).toFixed(1)} KB`
                            : `${(reduction / (1024 * 1024)).toFixed(2)} MB`;
                        })()}
                      </span>
                    </div>
                  )}
                  
                  {/* Compression Ratio */}
                  <div className="flex justify-between">
                    <span className="text-slate-300">Compression Ratio:</span>
                    <span className="text-slate-100 font-semibold">
                      {(() => {
                        if (metrics.compression_ratio) return metrics.compression_ratio;
                        const originalSize = metrics.original_size_bytes || imageFile?.size || 0;
                        if (originalSize && metrics.compressed_size_bytes) {
                          return `${(originalSize / metrics.compressed_size_bytes).toFixed(2)}:1`;
                        }
                        return 'N/A';
                      })()}
                    </span>
                  </div>
                  
                  {/* Savings Percentage */}
                  {(metrics.original_size_bytes || imageFile) && metrics.compressed_size_bytes && (
                    <div className="flex justify-between">
                      <span className="text-slate-300">Savings Percentage:</span>
                      <span className="text-green-400 font-semibold">
                        {(() => {
                          const originalSize = metrics.original_size_bytes || imageFile?.size || 0;
                          return (((originalSize - metrics.compressed_size_bytes) / originalSize) * 100).toFixed(1);
                        })()}%
                      </span>
                    </div>
                  )}
                  
                  {/* Compression Time */}
                  <div className="flex justify-between">
                    <span className="text-slate-300">Compression Time:</span>
                    <span className="text-slate-100 font-semibold">{metrics.processing_time_sec}s</span>
                  </div>
                  
                  {/* Speed/Throughput */}
                  {(metrics.original_size_bytes || imageFile) && metrics.processing_time_sec && (
                    <div className="flex justify-between">
                      <span className="text-slate-300">Throughput:</span>
                      <span className="text-slate-100 font-semibold">
                        {(() => {
                          const originalSize = metrics.original_size_bytes || imageFile?.size || 0;
                          return ((originalSize / 1024) / metrics.processing_time_sec).toFixed(1);
                        })()} KB/s
                      </span>
                    </div>
                  )}
                </div>
              </div>
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