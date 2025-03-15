import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // This provides a mock process.env object for client-side code
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      // Add any other environment variables that Dynamic Labs SDK might need
      // For example:
      DYNAMIC_ENVIRONMENT_ID: JSON.stringify(process.env.DYNAMIC_ENVIRONMENT_ID || 'fda698ee-d8ca-4c73-ac3c-f86687fea53c')
    },
    // For older libraries that might use just `process` without `.env`
    'process': {
      env: {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        DYNAMIC_ENVIRONMENT_ID: JSON.stringify(process.env.DYNAMIC_ENVIRONMENT_ID || 'fda698ee-d8ca-4c73-ac3c-f86687fea53c')
      }
    }
  }
}));
