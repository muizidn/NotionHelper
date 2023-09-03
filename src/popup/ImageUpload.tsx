import React from "react";
import { useState } from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import CopyToClipboard from "./CopyToClipboard";
import imageCompression from "browser-image-compression";
import { createStandaloneToast } from "@chakra-ui/toast";
import { Box, Text, Button, Input } from "@chakra-ui/react";

const { ToastContainer, toast } = createStandaloneToast();

const ImageUpload: React.FC = () => {
  const supabaseUrl = localStorage.getItem("supabaseUrl");
  const supabaseKey = localStorage.getItem("supabaseKey");

  return (
    <Box
      w="800px"
      maxW="md"
      mx="auto"
      p={4}
      bg="white"
      rounded="lg"
      shadow="md"
    >
      <Text fontSize="xl" fontWeight="semibold" mb={4}>
        Image Upload
      </Text>
      {supabaseUrl && supabaseKey ? (
        <_ImageUpload supabaseUrl={supabaseUrl} supabaseKey={supabaseKey} />
      ) : (
        <Text>Should set Supabase credentials</Text>
      )}
    </Box>
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
  const [compressedFileSize, setCompressedFileSize] = useState<string | null>(
    null
  );

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
    setFileSize(`File Size ${file.size / 1024} KB`);

    const compressedFile = await compressImage(file);
    if (!compressedFile) {
      setUploadError("Compress file failed");
      setUploading(false);
      return;
    }

    setCompressedFileSize(
      `Compressed File Size ${compressedFile.size / 1024} KB`
    );

    const { data, error } = await supabase.storage
      .from(supabaseBucket)
      .upload(`${supabaseFolder}/${file.name}-automatic`, compressedFile);

    if (error) {
      setUploadError("Error uploading image");
    } else if (data) {
      const d = supabase.storage.from(supabaseBucket).getPublicUrl(data.path);
      setPublicUrl(d.data.publicUrl);
      toast({ title: `Sucess upload image to ${supabase}/${supabaseFolder}` });
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

  const [dragging, setDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const { files } = e.dataTransfer;

    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  return (
    <Box
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      borderWidth={2}
      borderColor={dragging ? "blue.500" : "gray.200"}
      borderStyle="dashed"
      rounded="md"
      p={4}
      mb={4}
      textAlign="center"
    >
      {dragging ? (
        <Text color="blue.500">Drop the image here</Text>
      ) : (
        <>
        <Text>Drag and drop an image here or click to select one</Text>
        <Text>{ file?.name }</Text>
        </>
      )}
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
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
                {fileSize && <p className="text-green-500 mt-2">{fileSize}</p>}
                {compressedFileSize && (
                  <p className="text-green-500 mt-2">{compressedFileSize}</p>
                )}
                <CopyToClipboard>{publicUrl}</CopyToClipboard>
              </div>
            )}
          </>
        ) : (
          <p className="text-red-500 mt-2">Fix Supabase URL and key instead.</p>
        )}
        <ToastContainer />
      </>
    </Box>
  );
};
