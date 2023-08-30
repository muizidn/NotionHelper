import React, { useState } from "react";

interface CopyToClipboardProps {
  children: string;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ children }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(children.toString())
      .then(() => {
        setIsCopied(true);
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
      });
  };

  return (
    <div>
      <p>{children}</p>
      <button onClick={handleCopyClick}>
        {isCopied ? "Copied!" : "Copy to Clipboard"}
      </button>
    </div>
  );
};

export default CopyToClipboard;
