const react = require("@vitejs/plugin-react");
const { defineConfig } = require("vite");

module.exports = defineConfig({
    root: "example", 
    plugins: [react()],
});