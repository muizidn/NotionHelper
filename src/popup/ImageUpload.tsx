import React from "react";
import { useState } from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import CopyToClipboard from "./CopyToClipboard";
import imageCompression from "browser-image-compression";

const ImageUpload: React.FC = () => {
  const supabaseUrl = localStorage.getItem("supabaseUrl");
  const supabaseKey = localStorage.getItem("supabaseKey");

  return (
    <div className="w-[800px] max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Image Upload</h2>
      {supabaseUrl && supabaseKey ? (
        <_ImageUpload supabaseUrl={supabaseUrl} supabaseKey={supabaseKey} />
      ) : (
        <p>Should set Supabase credentials</p>
      )}
    </div>
  );
};

export default ImageUpload;

interface _ImageUploadProps {
  supabaseUrl: string;
  supabaseKey: string;
}

interface _ImageUploadProps {
  supabaseUrl: string;
  supabaseKey: string;
}

const _ImageUpload: React.FC<_ImageUploadProps> = ({
  supabaseUrl,
  supabaseKey,
}) => {
  const supabaseBucket = localStorage.getItem("supabaseBucket")!;
  const supabaseFolder = localStorage.getItem("supabaseFolder")!;

  let supabase: SupabaseClient | null;
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    supabase = null;
  }

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [compressedFileSize, setCompressedFileSize] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !supabase) return;

    setUploading(true);
    setUploadError(null);
    setPublicUrl(null);
    setFileSize(`File Size ${file.size / 1024} KB`)

    const compressedFile = await compressImage(file);
    if (!compressedFile) { 
        setUploadError("Compress file failed");
        setUploading(false);
        return;
    }

    setCompressedFileSize(`Compressed File Size ${compressedFile.size / 1024} KB`)

    const { data, error } = await supabase.storage
      .from(supabaseBucket)
      .upload(`${supabaseFolder}/${file.name}-automatic`, compressedFile);

    if (error) {
      setUploadError("Error uploading image");
    } else if (data) {
      const d = supabase.storage.from(supabaseBucket).getPublicUrl(data.path);
      setPublicUrl(d.data.publicUrl);
    }

    setUploading(false);
  };

  async function compressImage(file: File) {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {supabase ? (
        <>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2"
            />
          </div>
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
          {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
          {publicUrl && (
            <div>
              <p className="text-green-500 mt-2">Upload successful!</p>
              {fileSize && (<p className="text-green-500 mt-2">{ fileSize }</p>)}
              {compressedFileSize && (<p className="text-green-500 mt-2">{ compressedFileSize }</p>)}
              <CopyToClipboard>{publicUrl}</CopyToClipboard>
            </div>
          )}
        </>
      ) : (
        <p className="text-red-500 mt-2">Fix Supabase URL and key instead.</p>
      )}
    </>
  );
};
