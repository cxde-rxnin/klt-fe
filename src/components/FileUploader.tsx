import { useAppStore } from "../store/useAppStore";
import { useState } from "react";

export const FileUploader = () => {
  const { imageFile, setImageFile } = useAppStore();
  const [profile, setProfile] = useState<string>("default");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-2">
        1. Upload Image File
      </h3>
      {/* Profile Dropdown for image uploads */}
      <div>
        <label htmlFor="profile" className="block text-sm font-medium text-slate-300 mb-1">
          Image Type / Camera Model
        </label>
        <select
          id="profile"
          value={profile}
          onChange={e => setProfile(e.target.value)}
          className="block w-full p-2 rounded bg-slate-700 text-slate-200"
        >
          <option value="default">Default (Generic)</option>
          <option value="cameraA">Camera A</option>
          <option value="cameraB">Camera B</option>
        </select>
      </div>
      {/* JPG/PNG File Input */}
      <div>
        <label htmlFor="image-file" className="block text-sm font-medium text-slate-300 mb-1">
          Select JPG or PNG Image
        </label>
        <input
          id="image-file"
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleImageChange}
          className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
        />
        {imageFile && (
          <p className="text-xs text-slate-400 mt-1">
            Selected: {imageFile.name} (
            {imageFile.size < 1024 * 1024
              ? `${(imageFile.size / 1024).toFixed(1)} KB`
              : `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB`}
          </p>
        )}
      </div>
    </div>
  );
};