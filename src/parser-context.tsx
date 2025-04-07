import { createContext } from "react";

type LabelMetadata = {
  code: string;
  firstName: string;
  lastInitial: string;
  bagCount: number;
  date: string;
};

type ParserContextState = {
  loading: boolean;
  input: string;
  parsed: LabelMetadata | null;

  setInput: (input: string) => void;
  parseInput: () => Promise<void>;
  reset: () => void;
};

export const parserInitialState: ParserContextState = {
  loading: false,
  input: "",
  parsed: null,
  setInput: (_: string) => {},
  parseInput: async () => {},
  reset: () => {},
};
export const ParserContext = createContext(parserInitialState);
