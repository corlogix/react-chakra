import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // root: "./example",
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,


  },
  // optimizeDeps: {
  //   // include: ['@popperjs/core'],
  //   exclude: [
  //     // "@popperjs/core",
  //     // "react-clientside-effect",
  //     // "prop-types",
  //     // "react-icons"
  //   ]
  // }

});