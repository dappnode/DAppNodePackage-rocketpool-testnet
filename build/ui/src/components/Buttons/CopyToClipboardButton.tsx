import { useState } from "react";
import { IconButton, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const CopyToClipboardButton = (props: any) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
    try {
      navigator.clipboard.writeText(props.value);
    } catch {
      // Create a temporary textarea element
      const textarea = document.createElement("textarea");
      // Set the value of the textarea to the text to be copied
      textarea.value = props.value;
      // Append the textarea to the document body
      document.body.appendChild(textarea);
      // Select the text in the textarea
      textarea.select();
      // Copy the text to the clipboard
      document.execCommand("copy");
      // Remove the textarea from the document body
      document.body.removeChild(textarea);
    }
  };

  return (
    <>
      <IconButton onClick={() => handleClick()}>
        <ContentCopyIcon fontSize={props.fontSize ?? ""} />
      </IconButton>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
    </>
  );
};

export default CopyToClipboardButton;
