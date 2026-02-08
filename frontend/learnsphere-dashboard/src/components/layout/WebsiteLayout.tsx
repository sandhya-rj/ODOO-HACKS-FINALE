import { TopNavbar } from "./TopNavbar";
import { WebsiteFooter } from "./WebsiteFooter";

/**
 * Website-style layout — full-width, no sidebar.
 * Used for marketing/landing pages.
 */
export function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar />
      <main className="flex-1">{children}</main>
      <WebsiteFooter />
    </div>
  );
}
