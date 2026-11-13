/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import type { Matchers as TLMatchers } from "@testing-library/jest-dom"
import type { Assertion } from "vitest"

declare module "vitest" {
  interface Assertion<T = any> extends TLMatchers<typeof expect.stringContaining, T> {}
  interface AsymmetricMatchersContaining extends TLMatchers<typeof expect.stringContaining, any> {}
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}