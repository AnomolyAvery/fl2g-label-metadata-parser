import { HelpCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Textarea } from "./components/ui/textarea";
import { useContext } from "react";
import { ParserContext } from "./parser-context";

export function BarcodeForm() {
  const { setInput, input, parseInput, loading } = useContext(ParserContext);

  return (
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
            <p className="underline mb-1">To paste barcode content:</p>
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
                Paste the barcode content into the input field or click the
                "Paste & Parse" button.
              </li>
            </ol>
          </PopoverContent>
        </Popover>
      </div>
      <Textarea
        className="resize-none"
        placeholder={`Paste the barcode content of your label`}
        rows={15}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button className="w-full" onClick={parseInput} disabled={loading}>
        {loading ? "Loading..." : "Paste & Parse"}
      </Button>
    </div>
  );
}
