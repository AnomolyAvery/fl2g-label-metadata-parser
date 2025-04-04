import { lazy, Suspense, useState } from "react";
import "./App.css";
import { FoodLionLogo } from "./components/fl-logo";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";

const LabelDialog = lazy(() => import("./label-dialog"));

type LabelMetadata = {
  code: string;
  name: string;
  lastInitial: string;
  date: string;
  bagCount: number;
};

function App() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const parseValues = (data: string): LabelMetadata => {
    const codePattern = /\^FT790,969\^A0I,210,210\^FH\\\^FD(.*?)\^FS/;
    const namePattern = /\^FT803,789\^A0I,74,84\^FH\\\^FD(.*?)\^FS/;
    const lastInitialPattern = /\^FT800,716\^A0I,51,50\^FH\\\^FD(.*?)\^FS/;
    const datePattern = /\^FT755,250\^A0I,60,52\^FH\\\\\^FD(.*?)\^FS/;
    const bagCountPattern = /\^FT533,551\^A0I,130,150\^FH\\\^FD(\d+)\^FS/;

    // Parse the metadata using the regex patterns
    const codeMatch = data.match(codePattern);
    const nameMatch = data.match(namePattern);
    const dateMatch = data.match(datePattern);
    const bagCountMatch = data.match(bagCountPattern);
    const lastInitialMatch = data.match(lastInitialPattern);

    // Extract the matched values or use defaults if no match
    const code = codeMatch ? codeMatch[1].trim() : null;
    const name = nameMatch ? nameMatch[1].trim() : null;
    const date = dateMatch ? dateMatch[1].trim() : null;
    const bagCount = bagCountMatch ? Number(bagCountMatch[1].trim()) : null;
    const lastInitial = lastInitialMatch ? lastInitialMatch[1].trim() : null;

    const labelData: LabelMetadata = {
      code: code ? code : "NO_CODE",
      name: name ? name : "NO_NAME",
      lastInitial: lastInitial ? lastInitial : "NO_INITIAL",
      bagCount: bagCount ? bagCount : -1,
      date: date ? date : "NO_DATE",
    };
    // Return an object with the parsed metadata
    return labelData;
  };

  const [metadata, setMetadata] = useState<LabelMetadata | null>(null);

  const onParseClick = async () => {
    setLoading(true);
    try {
      const text = await navigator.clipboard.readText();
      setData((p) => {
        if (p == "") {
          return p;
        }
        return text;
      });

      const metadata = parseValues(data != "" ? data : text);
      setMetadata(metadata);
    } catch (err) {
      const msg = `An error occurred: ${(err as Error).message ?? "an unknown error occurred"}`;
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <ThemeProvider>
        <div className="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <div className="max-w-6xl mx-auto container space-y-6 px-2 md:px-20 py-12">
          <div className="p-4 max-w-md mx-auto flex flex-col items-center">
            <FoodLionLogo />
            <h1 className="text-lg sm:text-2xl font-bold">
              FL2G Label Metadata Parser
            </h1>
          </div>
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <Textarea
                className="resize-none"
                rows={15}
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={onParseClick}
              disabled={loading}
            >
              {loading ? "Loading..." : "Paste & Parse"}
            </Button>
            <Suspense
              fallback={
                <p className="font-medium text-muted-foreground text-center">
                  Loading...
                </p>
              }
            >
              <LabelDialog
                metadata={metadata}
                handleClose={() => {
                  setMetadata(null);
                  setData("");
                }}
              />
            </Suspense>
          </div>
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <a
              href="https://www.avery.gg"
              target="__blank"
              className="font-medium underline"
            >
              Avery Herring's
            </a>{" "}
            smarts, built with React and TypeScript. Enjoy! 🚀
          </p>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
