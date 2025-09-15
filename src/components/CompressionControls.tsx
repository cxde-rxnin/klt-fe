import { useAppStore } from "../store/useAppStore";
import axios from "axios";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const CompressionControls = () => {
  const {
    imageFile,
    startProcessing,
    setProcessingSuccess,
    setProcessingError,
    isProcessing,
  } = useAppStore();
  const [profile] = useState<string>("default");

  const handleCompress = async () => {
    if (!imageFile) {
      alert("Please upload a JPG or PNG image before starting compression.");
      return;
    }
    startProcessing();
    const formData = new FormData();
    formData.append("image_file", imageFile);
    formData.append("profile", profile);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/compress`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { metrics, reconstructed_image_preview, compressed_image } = response.data;
      setProcessingSuccess({ metrics, reconstructedImagePreview: reconstructed_image_preview, compressedImageHex: compressed_image });
      // Optionally handle compressed_image (hex string) for JPG/PNG
    } catch (err: any) {
      let errorMsg = err?.response?.data?.error || "Compression failed. Please try again.";
      setProcessingError(errorMsg);
    }
  };

  return (
    <div className="space-y-3">
      <button
        className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleCompress}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Start Compression'}
      </button>
    </div>
  );
};