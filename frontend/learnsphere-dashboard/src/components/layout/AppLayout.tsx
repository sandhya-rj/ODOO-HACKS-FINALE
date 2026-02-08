import { TopNavbar } from "./TopNavbar";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { WebsiteFooter } from "./WebsiteFooter";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-6 pb-20 lg:pb-6 min-w-0">{children}</main>
      </div>
      <WebsiteFooter />
      <MobileNav />
    </div>
  );
}
