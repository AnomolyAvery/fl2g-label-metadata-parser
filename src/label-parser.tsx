import { useState } from "react";
import { toast } from "sonner";
import { BarcodeForm } from "./barcode-form";
import LabelDialog from "./label-dialog";
import { ParserContext, parserInitialState } from "./parser-context";

export default function LabelParser() {
  const [input, setInput] = useState(parserInitialState.input);
  const [parsed, setParsed] = useState(parserInitialState.parsed);
  const [loading, setLoading] = useState(parserInitialState.loading);

  const parseInput = async () => {
    setLoading(true);

    const value = input || (await navigator.clipboard.readText());

    const codePattern = /\^FT790,969\^A0I,210,210\^FH\\\^FD(.*?)\^FS/;
    const firstNamePattern = /\^FT803,789\^A0I,74,84\^FH\\\^FD(.*?)\^FS/;
    const lastInitialPattern = /\^FT800,716\^A0I,51,50\^FH\\\^FD(.*?)\^FS/;
    const datePattern = /\^FT755,250\^A0I,60,52\^FH\\\\\^FD(.*?)\^FS/;
    const bagCountPattern = /\^FT533,551\^A0I,130,150\^FH\\\^FD(\d+)\^FS/;

    // Parse the metadata using the regex patterns
    const codeMatch = value.match(codePattern);
    const firstNameMatch = value.match(firstNamePattern);
    const dateMatch = value.match(datePattern);
    const bagCountMatch = value.match(bagCountPattern);
    const lastInitialMatch = value.match(lastInitialPattern);

    // Extract the matched values or use defaults if no match
    const code = codeMatch ? codeMatch[1].trim() : null;
    const firstName = firstNameMatch ? firstNameMatch[1].trim() : null;
    const date = dateMatch ? dateMatch[1].trim() : null;
    const bagCount = bagCountMatch ? Number(bagCountMatch[1].trim()) : null;
    const lastInitial = lastInitialMatch ? lastInitialMatch[1].trim() : null;

    if (!code || !firstName || !date || !bagCount || !lastInitial) {
      setParsed(null);
      setLoading(false);
      setInput("");
      toast.error("Invalid barcode content input!");
      return;
    }

    setParsed({
      bagCount,
      code,
      date,
      firstName,
      lastInitial,
    });
    setLoading(false);
  };

  const reset = () => {
    setInput("");
    setParsed(null);
  };

  return (
    <ParserContext.Provider
      value={{
        input,
        parsed,
        setInput,
        parseInput,
        reset,
        loading,
      }}
    >
      <BarcodeForm />
      <LabelDialog />
    </ParserContext.Provider>
  );
}
