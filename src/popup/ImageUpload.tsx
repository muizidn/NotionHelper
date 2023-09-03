import React, { useEffect } from "react";
import { useState } from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import CopyToClipboard from "./CopyToClipboard";
import imageCompression from "browser-image-compression";
import { createStandaloneToast } from "@chakra-ui/toast";
import {
  Box,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import imageRepo, { DbImage } from "../repo/image";
import { UUID } from "uuidjs";
import getHostInfo, { HostInfo } from "../getHostInfo";

const { ToastContainer, toast } = createStandaloneToast();

const ImageUpload: React.FC = () => {
  const supabaseUrl = localStorage.getItem("supabaseUrl");
  const supabaseKey = localStorage.getItem("supabaseKey");

  return (
    <Box w="800px" maxW="md" mx="auto" p={4} rounded="lg" shadow="md">
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
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [pageId, setPageId] = useState<string>('');
  const [compressedFileSize, setCompressedFileSize] = useState<string | null>(
    null
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !supabase || fileName.trim() === "") return;

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

    const fileNameUpdated = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(supabaseBucket)
      .upload(`${supabaseFolder}/${pageId}/${fileNameUpdated}`, compressedFile);

    if (error) {
      setUploadError("Error uploading image");
    } else if (data) {
      const d = supabase.storage.from(supabaseBucket).getPublicUrl(data.path);
      setPublicUrl(d.data.publicUrl);
      const id = await imageRepo.saveNewImage({
        id: UUID.genV4().toString(),
        imageUrl: d.data.publicUrl,
        size: compressedFile.size,
        name: fileName,
        pageId: pageId,
      });

      toast({
        title: `Sucess upload image to ${supabaseBucket}/${supabaseFolder} with id ${id}`,
      });
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
      setFileName(files[0].name);
    }
  };

  async function useEffectAsyncFunctions() {
    const hostInfo = await getHostInfo();
    const pageId = hostInfo.location.split("/").slice(-1)[0].split("-").slice(-1)[0];
    setPageId(pageId);
  }

  useEffect(() => {
    useEffectAsyncFunctions();
  }, []);

  return (
    <div>
      <div>{`Page ID: ${pageId}` || "No host info yet"}</div>
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
            <Text>{file?.name}</Text>
          </>
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <FormControl isRequired>
          <FormLabel htmlFor="fileName">File Name:</FormLabel>
          <Input
            type="text"
            id="fileName"
            value={fileName}
            onChange={handleFileNameChange}
            placeholder="Enter a file name"
          />
        </FormControl>
        <Button
          mt={4}
          type="submit"
          colorScheme="teal"
          onClick={handleUpload}
          disabled={!file || uploading || fileName.trim() === ""}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
        {uploadError && <Text color="red.500">{uploadError}</Text>}
        {publicUrl && (
          <div>
            <Text color="green.500">Upload successful!</Text>
            {fileSize && <Text color="green.500">{fileSize}</Text>}
            {compressedFileSize && (
              <Text color="green.500">{compressedFileSize}</Text>
            )}
            <CopyToClipboard>{publicUrl}</CopyToClipboard>
          </div>
        )}
        {!supabase && (
          <Text color="red.500 mt-2">Fix Supabase URL and key instead.</Text>
        )}
        <ToastContainer />
      </Box>
    </div>
  );
};
