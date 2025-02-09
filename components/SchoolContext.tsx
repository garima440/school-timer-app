// components/SchoolContext.tsx
import React, { createContext, useState, useContext } from 'react';

type SchoolData = {
  yearStart: string;
  yearEnd: string;
  dayStart: string;
  dayEnd: string;
};

type SchoolContextType = {
  schoolData: SchoolData;
  setSchoolData: React.Dispatch<React.SetStateAction<SchoolData>>;
};

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolData, setSchoolData] = useState<SchoolData>({
    yearStart: "",
    yearEnd: "",
    dayStart: "",
    dayEnd: "",
  });

  return (
    <SchoolContext.Provider value={{ schoolData, setSchoolData }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchoolContext = () => {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchoolContext must be used within a SchoolProvider');
  }
  return context;
};
