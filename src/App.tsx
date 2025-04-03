import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";

type LabelMetadata = {
  code: string;
  name: string;
  date: string;
  bagCount: number;
};

function App() {
  const [data, setData] = useState("");

  const parseValues = (data: string): LabelMetadata => {
    const codePattern = /\^FT790,969\^A0I,210,210\^FH\\\^FD(.*?)\^FS/;
    const namePattern = /\^FT803,789\^A0I,74,84\^FH\\\^FD(.*?)\^FS/;
    const datePattern = /\^FT755,250\^A0I,60,52\^FH\\\\\^FD(.*?)\^FS/;
    const bagCountPattern = /\^FT533,551\^A0I,130,150\^FH\\\^FD(\d+)\^FS/;

    // Parse the metadata using the regex patterns
    const codeMatch = data.match(codePattern);
    const nameMatch = data.match(namePattern);
    const dateMatch = data.match(datePattern);
    const bagCountMatch = data.match(bagCountPattern);

    // Extract the matched values or use defaults if no match
    const code = codeMatch ? codeMatch[1].trim() : null;
    const name = nameMatch ? nameMatch[1].trim() : null;
    const date = dateMatch ? dateMatch[1].trim() : null;
    const bagCount = bagCountMatch ? Number(bagCountMatch[1].trim()) : null;

    const labelData: LabelMetadata = {
      code: code ? code : "NO_CODE",
      name: name ? name : "NO_NAME",
      bagCount: bagCount ? bagCount : -1,
      date: date ? date : "NO_DATE",
    };
    // Return an object with the parsed metadata
    return labelData;
  };

  const [metadata, setMetadata] = useState<LabelMetadata | null>(null);

  const onParseClick = () => {
    navigator.clipboard.readText().then((text) => {
      setData((p) => {
        if (p != "") {
          return p;
        }

        return text;
      });
      const metadata = parseValues(data != "" ? data : text);
      setMetadata(metadata);
    });
  };

  return (
    <div className="max-w-6xl mx-auto container space-y-6">
      <h1 className="text-2xl font-bold">FL2G Label Metadata Parser</h1>
      <div className="max-w-md mx-auto space-y-2">
        <div>
          <Textarea
            className="resize-none"
            rows={20}
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <Button className="w-full" onClick={onParseClick}>
          Paste & Parse
        </Button>
        <Dialog open={metadata != null}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{metadata?.name}</DialogTitle>
            </DialogHeader>
            <ul>
              <li>Code: {metadata?.code}</li>
              <li>Name: {metadata?.name}</li>
              <li>Bag Count: {metadata?.bagCount}</li>
              <li>Date: {metadata?.date}</li>
            </ul>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    setMetadata(null);
                    setData("");
                  }}
                  type="button"
                  variant="secondary"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
