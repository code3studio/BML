import { Box, Container } from "@mui/material";
import ResponsiveAppBar from "./header/header";
import { Outlet } from "react-router-dom";

type Props = {};

const MainLayout = (props: Props) => {
  return (
    <Container>
      <ResponsiveAppBar />
      <Box mt={10} />
      <Outlet />
    </Container>
  );
};

export default MainLayout;
