interface EmptyStateProps {
  message: string;
  variant?: "inline" | "bordered";
}

const EmptyState = ({ message, variant = "inline" }: EmptyStateProps) => {
  if (variant === "bordered") {
    return (
      <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
        {message}
      </div>
    );
  }

  return <p className="text-muted-foreground text-sm">{message}</p>;
};

export default EmptyState;
