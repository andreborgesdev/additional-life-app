import * as React from "react"
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import Router from "./components/Router"
import Home from "./components/Home"

export const App = () => (
  <ChakraProvider theme={theme}>
      <Home />
  </ChakraProvider>
)