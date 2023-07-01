import { createContext } from "react";

export const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  return <LayoutContext.Provider value={{}}>{children}</LayoutContext.Provider>;
};
