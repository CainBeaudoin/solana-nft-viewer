import { Buffer } from 'buffer';

// Must set Buffer globally BEFORE any other imports
window.Buffer = Buffer;
(globalThis as any).Buffer = Buffer;

// Process polyfill
window.process = window.process || { env: {}, browser: true } as any;
(globalThis as any).process = window.process;
