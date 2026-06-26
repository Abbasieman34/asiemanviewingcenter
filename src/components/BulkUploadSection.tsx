import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BulkUploadSectionProps {
  entityName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exampleJson: string;
  bulkData: string;
  onBulkDataChange: (data: string) => void;
  onUpload: () => void;
  loading: boolean;
  countKey: string;
}

const BulkUploadSection = ({
  entityName,
  open,
  onOpenChange,
  exampleJson,
  bulkData,
  onBulkDataChange,
  onUpload,
  loading,
  countKey,
}: BulkUploadSectionProps) => {
  const count = bulkData ? bulkData.split(`"${countKey}"`).length - 1 : 0;

  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="mb-6">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Bulk Upload {entityName}
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Paste a JSON array of {entityName.toLowerCase()}. Example:
          </p>
          <pre className="bg-secondary/50 p-3 rounded text-xs overflow-x-auto">
            {exampleJson}
          </pre>
          <Textarea
            placeholder="Paste JSON array here..."
            value={bulkData}
            onChange={(e) => onBulkDataChange(e.target.value)}
            rows={8}
            className="font-mono text-xs"
          />
          <Button onClick={onUpload} disabled={loading || !bulkData}>
            <Upload className="h-4 w-4 mr-2" /> Upload {bulkData ? `(${count} ${entityName.toLowerCase()})` : ""}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BulkUploadSection;
