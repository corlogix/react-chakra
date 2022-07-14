import React from "react";
import { createRoot } from "react-dom/client";

import RichTextEditor from "./src";

import "./example.scss";
import { ChakraProvider, Container } from "@chakra-ui/react";

const App = () => {
  return (
    <ChakraProvider>
      <Container>
        <RichTextEditor value={""} onChange={console.log} serializeOnChange />
      </Container>
    </ChakraProvider>
  );
};

const root = createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
