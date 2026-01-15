/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_API_URL?: string;
    readonly NEXT_PUBLIC_STRIPE_KEY?: string;
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}
