import type { ReactNode } from "react";

interface ContactCardProps {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  external?: boolean;
  truncate?: boolean;
}

const ContactCard = ({ href, icon, label, value, external = false, truncate = false }: ContactCardProps) => {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 card-hover hover:border-primary/50 transition-colors"
    >
      <div className="gold-gradient p-2.5 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm font-semibold text-foreground ${truncate ? "truncate" : ""}`}>{value}</p>
      </div>
    </a>
  );
};

export default ContactCard;
