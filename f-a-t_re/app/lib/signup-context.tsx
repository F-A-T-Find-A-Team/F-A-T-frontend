'use client';

import { createContext, useContext, useState } from 'react';
import type { Gender } from './api';

export interface SignupDraft {
  email: string;
  password: string;
  nickname: string;
  studentId: string;
  name: string;
  gender: Gender;
  bio: string;
  majors: string[];
  techStacks: string[];
  verificationId: string;
}

const SignupContext = createContext<{
  draft: SignupDraft | null;
  setDraft: (draft: SignupDraft | null) => void;
}>({ draft: null, setDraft: () => undefined });

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<SignupDraft | null>(null);
  return <SignupContext.Provider value={{ draft, setDraft }}>{children}</SignupContext.Provider>;
}

export function useSignupDraft() {
  return useContext(SignupContext);
}