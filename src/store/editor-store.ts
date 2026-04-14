import { create } from "zustand"

import {
  EditorLanguage,
  TokenMessage,
  TokenValidationStatus,
  type EditorStoreState,
} from "@/types"

const defaultDescription =
  "Develop a function that generates a fractal-like array structure based on a depth parameter n."

const defaultCode = `function buildFractal(depth) {
  // Your implementation here
  if (depth === 0) {
    return 1;
  }

  const inner = buildFractal(depth - 1);
  return [1, inner, 1];
}

// Test the output
console.log(buildFractal(3));
`

export const useEditorStore = create<EditorStoreState>((set) => ({
  description: defaultDescription,
  code: defaultCode,
  language: EditorLanguage.JavaScript,
  accessToken: null,
  tokenStatus: TokenValidationStatus.Idle,
  tokenMessage: TokenMessage.WaitingForToken,
  tokenSubject: undefined,
  setDescription: (nextDescription) => set({ description: nextDescription }),
  setCode: (nextCode) => set({ code: nextCode }),
  setAccessToken: (nextToken) => set({ accessToken: nextToken }),
  setTokenStatus: (nextStatus) => set({ tokenStatus: nextStatus }),
  setTokenValidation: (result, status) =>
    set({
      tokenStatus:
        status ??
        (result.valid
          ? TokenValidationStatus.Valid
          : TokenValidationStatus.Invalid),
      tokenMessage: result.message,
      tokenSubject: result.subject,
    }),
}))
