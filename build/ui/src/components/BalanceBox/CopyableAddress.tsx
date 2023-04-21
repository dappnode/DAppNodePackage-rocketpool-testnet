import { TextField, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

function CopyableTextField({
  value,
  label,
}: {
  value: string;
  label: string;
}): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copiedAlert, setCopiedAlert] = useState(false);

  const handleCopy = async () => {
    if (inputRef.current) {
      inputRef.current.select();
      try {
        await navigator.clipboard.writeText(inputRef.current.value);
        setCopiedAlert(true);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  // CopiedAlert should be set to false after 1 second
  useEffect(() => {
    if (copiedAlert) {
      setTimeout(() => {
        setCopiedAlert(false);
      }, 1000);
    }
  }, [copiedAlert]);

  return (
    <div style={{ marginTop: "15px", marginBottom: 2 }}>
      <Tooltip title="Copy to clipboard">
        <TextField
          inputRef={inputRef}
          value={value}
          label={label}
          id="outlined-size-small"
          defaultValue="Address"
          size="small"
          contentEditable={false}
          onSelect={(event: React.FocusEvent<HTMLInputElement>) =>
            event.target.setSelectionRange(0, 0)
          }
          inputProps={{
            style: {
              width: `${value.length}ch`,
              cursor: "pointer",
              userSelect: "none",
            },
            size: value.length,
          }}
          onClick={handleCopy}
        />
      </Tooltip>
      {copiedAlert && (
        <div
          style={{
            backgroundColor: "#f2f2f2",
            color: "#555",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            marginTop: "4px",
            opacity: 1,
            transition: "opacity 1s ease-out",
          }}
        >
          Copied to clipboard
        </div>
      )}
    </div>
  );
}

export default CopyableTextField;
