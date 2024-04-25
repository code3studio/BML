import { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeContext } from "./context/themeContext.ts";
import { PaletteMode, ThemeProvider } from "@mui/material";
import { customTheme } from "./styles/theme.ts";

const AppWrapper = () => {
  const [themeMode, setThemeMode] = useState<PaletteMode>("light");

  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };
  console.log("env==", import.meta.env.VITE_API_URL);

  return (
    // <React.StrictMode>
    <ThemeContext.Provider value={{ themeMode, toggleThemeMode }}>
      {/* <PageContextProvider> */}
      <ThemeProvider theme={customTheme(themeMode)}>
        {/* <TonConnectUIProvider manifestUrl={import.meta.env.VITE_API_URL +"manifest.json"}> */}
        <App />
        {/* </TonConnectUIProvider> */}
      </ThemeProvider>
      {/* </PageContextProvider> */}
    </ThemeContext.Provider>
    // </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);
