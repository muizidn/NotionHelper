import { useState, useEffect } from "react";

const SupabaseCredential: React.FC = () => {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [supabaseBucket, setSupabaseBucket] = useState("");
  const [supabaseFolder, setSupabaseFolder] = useState("");

  useEffect(() => {
    const env = import.meta.env;
    const localStorageKeyMap = {
      supabaseUrl: env.VITE_SUPABASE_URL,
      supabaseKey: env.VITE_SUPABASE_KEY,
      supabaseBucket: env.VITE_SUPABASE_BUCKET,
      supabaseFolder: env.VITE_SUPABASE_FOLDER,
    };

    Object.entries(localStorageKeyMap).forEach(([key, value]) => {
      const localStorageValue = localStorage.getItem(key);
      if (value) {
        localStorageValue && localStorage.setItem(key, value);
        switch (key) {
          case "supabaseUrl":
            setSupabaseUrl(value);
            break;
          case "supabaseKey":
            setSupabaseKey(value);
            break;
          case "supabaseBucket":
            setSupabaseBucket(value);
            break;
          case "supabaseFolder":
            setSupabaseFolder(value);
            break;
          default:
            break;
        }
      }
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
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
    <div className="w-[800px] h-[800px] max-w-md mx-auto p-4 bg-white rounded-lg">
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
