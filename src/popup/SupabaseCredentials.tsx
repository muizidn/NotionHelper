import { useState, useEffect } from "react";

const SupabaseCredential: React.FC = () => {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [supabaseBucket, setSupabaseBucket] = useState("");
  const [supabaseFolder, setSupabaseFolder] = useState("");

  useEffect(() => {
    const savedSupabaseUrl = localStorage.getItem("supabaseUrl");
    const savedSupabaseKey = localStorage.getItem("supabaseKey");
    const savedSupabaseBucket = localStorage.getItem("supabaseBucket");
    const savedSupabaseFolder = localStorage.getItem("supabaseFolder");

    if (savedSupabaseUrl) setSupabaseUrl(savedSupabaseUrl);
    if (savedSupabaseKey) setSupabaseKey(savedSupabaseKey);
    if (savedSupabaseBucket) setSupabaseBucket(savedSupabaseBucket);
    if (savedSupabaseFolder) setSupabaseFolder(savedSupabaseFolder);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    if (field === "supabaseUrl") {
      setSupabaseUrl(value);
      localStorage.setItem("supabaseUrl", value);
    } else if (field === "supabaseKey") {
      setSupabaseKey(value);
      localStorage.setItem("supabaseKey", value);
    } else if (field === "supabaseBucket") {
      setSupabaseBucket(value);
      localStorage.setItem("supabaseBucket", value);
    } else if (field === "supabaseFolder") {
      setSupabaseFolder(value);
      localStorage.setItem("supabaseFolder", value);
    }
  };

  return (
    <div className="w-[800px] max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Supabase Credentials</h2>
      <div className="mb-4">
        <label className="block mb-2">Supabase URL:</label>
        <input
          type="text"
          value={supabaseUrl}
          onChange={(e) => handleInputChange(e, "supabaseUrl")}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Supabase Key:</label>
        <input
          type="text"
          value={supabaseKey}
          onChange={(e) => handleInputChange(e, "supabaseKey")}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Supabase Bucket:</label>
        <input
          type="text"
          value={supabaseBucket}
          onChange={(e) => handleInputChange(e, "supabaseBucket")}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Supabase Folder:</label>
        <input
          type="text"
          value={supabaseFolder}
          onChange={(e) => handleInputChange(e, "supabaseFolder")}
          className="border p-2 w-full"
        />
      </div>
    </div>
  );
};

export default SupabaseCredential;
