import { HelpCircle } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { toast } from "sonner";
import { FoodLionLogo } from "./components/fl-logo";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Spinner } from "./components/ui/spinner";
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

  const parseMetadata = (data: string): LabelMetadata | null => {
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

    if (!code || !name || !date || !bagCount || !lastInitial) {
      return null;
    }
    // Return an object with the parsed metadata
    return {
      code,
      name,
      lastInitial,
      bagCount,
      date,
    };
  };

  const [metadata, setMetadata] = useState<LabelMetadata | null>(null);

  const onParseClick = async () => {
    setLoading(true);
    try {
      const dataValue = data || (await navigator.clipboard.readText());
      setData(dataValue);
      const metadata = parseMetadata(dataValue);
      if (!metadata) {
        toast.error("Invalid barcode data");
        setData("");
      }
      setMetadata(metadata);
    } catch (err) {
      const msg = `An error occurred: ${(err as Error).message ?? "an unknown error occurred"}`;
      toast.error(msg);
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
            <h1 className="text-lg sm:text-2xl font-bold">FL2G Stagging Hub</h1>
          </div>
          <div className="max-w-md mx-auto space-y-8">
            <Suspense
              fallback={
                <div className="flex items-center gap-2 justify-center">
                  <Spinner size={"medium"} />
                  <p className="font-medium text-center">Loading...</p>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Barcode Content</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground">
                        <HelpCircle className="h-5 w-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-[300px]">
                      <p className="underline mb-1">
                        To paste barcode content:
                      </p>
                      <ol className="list-decimal ml-4">
                        <li>
                          Download QR Code Scanner App:{" "}
                          <a
                            className="font-bold"
                            target="__blank"
                            href="https://apps.apple.com/us/app/code-scan-scan-any-barcode/id1554812545"
                          >
                            iOS
                          </a>{" "}
                          or{" "}
                          <a
                            className="font-bold"
                            target="__blank"
                            href="https://play.google.com/store/apps/details?id=com.kurzdigital.android.codescan&utm_source=na_Med"
                          >
                            Android
                          </a>
                        </li>
                        <li>Scan the barcode & click copy</li>
                        <li>
                          Paste the barcode content into the input field or
                          click the "Paste & Parse" button.
                        </li>
                      </ol>
                    </PopoverContent>
                  </Popover>
                </div>
                <Textarea
                  className="resize-none"
                  placeholder={`Paste the barcode content of your label`}
                  rows={15}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
                <Button
                  className="w-full"
                  onClick={onParseClick}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Paste & Parse"}
                </Button>
              </div>

              <LabelDialog
                metadata={metadata}
                handleClose={() => {
                  setMetadata(null);
                  setData("");
                }}
              />
            </Suspense>
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
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
