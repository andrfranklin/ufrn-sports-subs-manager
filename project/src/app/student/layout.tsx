"use client";
import { StudentSidebarProvider } from "@/contexts/StudentSidebarContext";
import StudentSidebar from "@/layout/StudentSidebar";
import AppHeader from "@/layout/AppHeader";
import Backdrop from "@/layout/Backdrop";
import { useStudentSidebar } from "@/contexts/StudentSidebarContext";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentSidebarProvider>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </StudentSidebarProvider>
  );
}

function StudentLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useStudentSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";
    
  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar />
      <Backdrop />
      
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 2xl:p-10 bg-gray-50 dark:bg-gray-900">
          <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 