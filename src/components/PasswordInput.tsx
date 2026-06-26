import { Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
}

const PasswordInput = ({
  value,
  onChange,
  placeholder = "Password",
  ariaLabel = "Password",
  showPassword,
  onToggleVisibility,
  onKeyDown,
  showToggle = true,
}: PasswordInputProps) => {
  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type={showPassword ? "text" : "password"}
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className={`pl-10 ${showToggle ? "pr-10" : ""}`}
      />
      {showToggle && (
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
};

export default PasswordInput;
