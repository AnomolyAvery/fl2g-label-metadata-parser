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

type LabelMetadata = {
  code: string;
  name: string;
  lastInitial: string;
  bagCount: number;
  date: string;
};

interface LabelDialogProps {
  metadata: LabelMetadata | null;
  handleClose: () => void;
}

export default function LabelDialog({
  metadata,
  handleClose,
}: LabelDialogProps) {
  return (
    <Dialog open={metadata != null} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {metadata?.code} - {metadata?.name} {metadata?.lastInitial}
          </DialogTitle>
          <DialogDescription>
            Label metadata for {metadata?.name} {metadata?.lastInitial} (
            <span className="font-medium">{metadata?.code}</span>)
          </DialogDescription>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-x-4 gap-y-6">
          <LabelMetadataEntry
            className="sm:col-span-2"
            name="Code"
            value={metadata?.code}
          />
          <LabelMetadataEntry name="Name" value={metadata?.name} />
          <LabelMetadataEntry
            name="Last Initial"
            value={metadata?.lastInitial}
          />
          <LabelMetadataEntry
            name="Bag Count"
            value={metadata?.bagCount.toString() ?? undefined}
          />
          <LabelMetadataEntry name="Date" value={metadata?.date} />
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
