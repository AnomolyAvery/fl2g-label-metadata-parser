import { useContext } from "react";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { cn } from "./lib/utils";
import { ParserContext } from "./parser-context";

export default function LabelDialog() {
  const { parsed, reset } = useContext(ParserContext);

  return (
    <Dialog open={parsed != null} onOpenChange={reset}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {parsed?.code} - {parsed?.firstName} {parsed?.lastInitial}
          </DialogTitle>
          <DialogDescription>
            Label metadata for {parsed?.firstName} {parsed?.lastInitial} (
            <span className="font-medium">{parsed?.code}</span>)
          </DialogDescription>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-x-4 gap-y-6">
          <LabelMetadataEntry
            className="sm:col-span-2"
            name="Code"
            value={parsed?.code}
          />
          <LabelMetadataEntry name="First Name" value={parsed?.firstName} />
          <LabelMetadataEntry name="Last Initial" value={parsed?.lastInitial} />
          <LabelMetadataEntry
            name="Bag Count"
            value={parsed?.bagCount.toString() ?? undefined}
          />
          <LabelMetadataEntry name="Date" value={parsed?.date} />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface LabelMetadataEntryProps {
  name: string;
  value?: string;
  className?: string;
}

function LabelMetadataEntry({
  name,
  value,
  className,
}: LabelMetadataEntryProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label>{name}:</Label>
      <Input readOnly value={value ?? ""} />
    </div>
  );
}
