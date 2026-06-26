import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
}

const SectionHeader = ({ icon: Icon, title, className = "" }: SectionHeaderProps) => {
  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <Icon className="h-6 w-6 text-primary" />
      <h2 className="text-3xl text-primary">{title}</h2>
    </div>
  );
};

export default SectionHeader;
