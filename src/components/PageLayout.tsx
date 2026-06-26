import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  canonicalPath: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  noIndex?: boolean;
  showHeader?: boolean;
}

const BASE_URL = "https://asiemanviewingcenter.lovable.app";

const PageLayout = ({
  children,
  title,
  description,
  canonicalPath,
  ogTitle,
  ogDescription,
  ogType = "website",
  noIndex = false,
  showHeader = true,
}: PageLayoutProps) => {
  const fullUrl = `${BASE_URL}${canonicalPath}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={fullUrl} />
        {noIndex && <meta name="robots" content="noindex" />}
        {ogTitle && <meta property="og:title" content={ogTitle} />}
        {ogDescription && <meta property="og:description" content={ogDescription} />}
        <meta property="og:url" content={fullUrl} />
        {ogType && <meta property="og:type" content={ogType} />}
      </Helmet>
      {showHeader && <Header />}
      {children}
    </div>
  );
};

export default PageLayout;
