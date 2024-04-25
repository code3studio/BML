import { Grid, Paper, Typography, styled } from "@mui/material";
import React from "react";
import CustomizedSteppers from "./components/TokenFormLayout";

type Props = {};
const FormRoot = styled(Paper)(({ theme }) => ({
  padding: 30,
  borderRadius: 10,
  marginTop: 50,
  // backgroundColor: theme.palette.primary.main,
  // color: "white",
}));

const TokenPage = (props: Props) => {
  return (
    <>
      <Grid container justifyContent={"center"}>
        <Typography variant="h5">Launch on base in seconds</Typography>
      </Grid>
      <FormRoot>
        <CustomizedSteppers />
      </FormRoot>
    </>
  );
};

export default TokenPage;
