"use client";
import React, { createContext, useContext, useState } from "react";

interface StudentSidebarContextType {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  setIsExpanded: (expanded: boolean) => void;
  setIsMobileOpen: (mobileOpen: boolean) => void;
  setIsHovered: (hovered: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}

const StudentSidebarContext = createContext<StudentSidebarContextType | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(StudentSidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const StudentSidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <StudentSidebarContext.Provider
      value={{
        isExpanded,
        isMobileOpen,
        isHovered,
        setIsExpanded,
        setIsMobileOpen,
        setIsHovered,
        toggleSidebar,
        toggleMobileSidebar,
      }}
    >
      {children}
    </StudentSidebarContext.Provider>
  );
};

export const useStudentSidebar = () => {
  const context = useContext(StudentSidebarContext);
  if (context === undefined) {
    throw new Error("useStudentSidebar must be used within a StudentSidebarProvider");
  }
  return context;
}; 