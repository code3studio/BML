import { PaletteMode } from "@mui/material";
import { ThemeOptions, createTheme } from "@mui/material/styles";

const theme: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1372,
      xl: 1536,
    },
  },

  palette: {
    background: {
      paper: "#fff",
      default: "#F9FAFE",
    },
    grey: {
      50: "#F9FAFE",
      100: "#EDF0F7",
      200: "#DFE4EC",
      300: "#CCD2DC",
      400: "#A5A9B0",
      500: "#93949F",
      600: "#6A6F7A",
      700: "#484B50",
      800: "#303239",
    },
    // text: {
    //   secondary: "#FFAF59",
    //   disabled: "#6A6F7A",
    // },
    primary: {
      main: "#5754E1",
    },
    secondary: {
      main: "#38D7A8",
      contrastText: "rgba(249,249,249,0.87)",
    },
  },
  typography: {
    fontFamily: "Satoshi-Bold",
    h1: {
      fontSize: "96px",
      fontWeight: 900,
    },
    subtitle1: {
      fontSize: "20px",
      fontWeight: 900,
    },
    caption: {
      fontSize: "14px",
      fontWeight: 700,
      color: "#93949F",
    },
    body2: {
      fontSize: "14px",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          //   border: 0,
          borderRadius: 20,
          textTransform: "capitalize",
          fontWeight: 400,
          fontSize: "16px",

          //   boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
          // //   color: 'white',
          height: 38,
          padding: "0 30px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          color: "#CCD2DC",
          fontSize: "16px",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
  },
};

export const customTheme = (mode: PaletteMode) =>
  mode === "light"
    ? createTheme({ ...theme })
    : createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode: "dark",
          background: {
            // paper: 'red',
            default: "#F9FAFE",
          },
        },
      });
