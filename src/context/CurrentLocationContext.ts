import { createContext } from "react";

type UrlContextType = {
  url: string;
};

const CurrentLocationContext: React.Context<UrlContextType> =
  createContext<UrlContextType>({
    url: "",
  });

export default CurrentLocationContext;
