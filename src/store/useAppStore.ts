// frontend/src/store/useAppStore.ts

import { create } from 'zustand';

// Define the structure of the results we expect from the backend
interface Metrics {
  compression_ratio: string;
  psnr_db?: number;
  mean_sam_degrees?: number;
  processing_time_sec: number;
  original_size_bytes?: number;
  compressed_size_bytes?: number;
}

interface AppState {
  // --- State Variables ---
  hdrFile: File | null;
  rawFile: File | null;
  kComponents: number;
  isProcessing: boolean;
  errorMessage: string | null;
  
  // Data returned from the backend
  metrics: Metrics | null;
  reconstructedImagePreview: number[][] | null;
  imageFile: File | null;
  compressedImageHex: string | null;

  // --- Actions (functions to update the state) ---
  setHdrFile: (file: File | null) => void;
  setRawFile: (file: File | null) => void;
  setKComponents: (k: number) => void;
  startProcessing: () => void;
  setProcessingSuccess: (results: { metrics: Metrics; reconstructedImagePreview: number[][]; compressedImageHex?: string }) => void;
  setProcessingError: (message: string) => void;
  resetState: () => void;
  setImageFile: (file: File | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  hdrFile: null,
  rawFile: null,
  kComponents: 20, // Default value
  isProcessing: false,
  errorMessage: null,
  metrics: null,
  reconstructedImagePreview: null,
  imageFile: null, // Initialize new state variable
  compressedImageHex: null, // Initialize new state variable

  // --- Implementations of Actions ---
  setHdrFile: (file) => set({ hdrFile: file, errorMessage: null }),
  setRawFile: (file) => set({ rawFile: file, errorMessage: null }),
  setKComponents: (k) => set({ kComponents: k }),
  
  startProcessing: () => set({ 
    isProcessing: true, 
    errorMessage: null, 
    metrics: null, 
    reconstructedImagePreview: null 
  }),
  
  setProcessingSuccess: (results) => set({
    isProcessing: false,
    metrics: results.metrics,
    reconstructedImagePreview: results.reconstructedImagePreview,
    compressedImageHex: results.compressedImageHex || null,
    errorMessage: null,
  }),

  setProcessingError: (message) => set({
    isProcessing: false,
    errorMessage: message,
    metrics: null,
    reconstructedImagePreview: null,
  }),
  
  resetState: () => set({
    hdrFile: null,
    rawFile: null,
    isProcessing: false,
    errorMessage: null,
    metrics: null,
    reconstructedImagePreview: null
  }),

  setImageFile: (file) => set({ imageFile: file }), // Implement new action
}));