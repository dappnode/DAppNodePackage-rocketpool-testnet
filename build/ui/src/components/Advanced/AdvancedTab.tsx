import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import JsonView from "@uiw/react-json-view";
import { AppService } from "../../services/AppService";

interface AdvancedTabProps {}

const AdvancedTab: React.FC<AdvancedTabProps> = (): JSX.Element => {
  const [command, setCommand] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [outputLines, setOutputLines] = useState<Array<string | object>>([]);
  const [loadingCommand, setLoadingCommand] = useState<boolean>(false);
  const appService = new AppService();

  const outputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the bottom of the TextField whenever the output is updated
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputLines]);

  const handleCommandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    setLoadingCommand(true);
    event.preventDefault();

    const output = await appService.runCustomCommand(command);

    // Append the command and output to the output box
    try {
      const jsonOutput = JSON.parse(output);
      setOutputLines((prevOutputLines) => [...prevOutputLines, jsonOutput]);
    } catch (error) {
      setOutputLines((prevOutputLines) => [...prevOutputLines, output]);
    }
    setCommandHistory((prevCommandHistory) => [...prevCommandHistory, command]);

    // Clear the input field
    setCommand("");
    setLoadingCommand(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Box width={"40rem"} p={2}>
          <Alert severity="warning" variant="filled">
            <AlertTitle>Advanced Users Only</AlertTitle>
            This tab is designed for advanced users. It allows sending commands
            to the rocketpool binary and displays the output obtained. Type --help
            for a list of available commands.
          </Alert>
        </Box>
      </div>

      <Box
        sx={{
          px: 4,
        }}
      >
        <Box
          mt={2}
          p={1}
          height={300}
          overflow="auto"
          borderRadius={1}
          sx={{ backgroundColor: "grey.200" }}
          ref={outputRef}
        >
          {outputLines.map((line, index) => (
            <div key={`output-line-${index}`}>
              <pre
                style={{
                  margin: 0,
                  fontFamily: "Ubuntu Mono, monospace",
                  fontSize: "14px",
                  color: "#555555",
                  textAlign: "left",
                  fontWeight: "bold",
                }}
              >
                rocketpoold-api:~$ {commandHistory[index]}
              </pre>
              {typeof line === "object" ? (
                <JsonView
                  value={line}
                  displayDataTypes={false}
                  collapsed
                  shortenTextAfterLength={100}
                  style={{
                    textAlign: "left"
                  }}
                />
              ) : (
                <pre
                style={{
                  whiteSpace: "pre-wrap",
                  margin: 0,
                  fontFamily: "Ubuntu Mono, monospace",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  color: "#555555",
                  textAlign: "left",
                  overflowWrap: "break-word",
                  wordBreak: "break-all",
                }}>
                  {line || "Error: Invalid command"}
                </pre>
              )}
            </div>
          ))}
        </Box>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", marginTop: "16px" }}
        >
          <TextField
            label="Enter Command (Example: node status)"
            value={command}
            onChange={handleCommandChange}
            fullWidth
            InputProps={{
              disableUnderline: true,
              style: {
                fontFamily: "Ubuntu Mono, monospace",
                fontSize: "14px",
                lineHeight: "1.4",
                color: "#555555",
              },
            }}
            InputLabelProps={{
              style: {
                fontFamily: "Ubuntu Mono, monospace",
                fontSize: "14px",
                lineHeight: "1.4",
                color: "#555555",
              },
            }}
            sx={{ backgroundColor: "grey.200" }}
          />
          {!loadingCommand ? (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginLeft: "1rem" }}
              disabled={command === ""}
            >
              Submit
            </Button>
          ) : (
            <CircularProgress style={{ marginLeft: "1rem" }} />
          )}
        </form>
      </Box>
    </div>
  );
};

export default AdvancedTab;
