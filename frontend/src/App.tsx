import { Suspense } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routers/routers";
import { css, useTheme } from "@mui/material";
import { Global } from "@emotion/react";

function App() {
  const theme = useTheme();

  const generateGlobalStyles = (props: any) => css`
    body {
      background-color: ${props || "#f0f0f0"};
    }
  `;
  return (
    <>
      <Global
        styles={generateGlobalStyles(
          theme.palette.mode === "dark"
            ? theme.palette.grey[700]
            : theme.palette.grey[100]
        )}
      />
      <Suspense fallback={<p>loading...</p>}>
        <RouterProvider router={routes} />
      </Suspense>
    </>
  );
}

export default App;
