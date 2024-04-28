import { Grid, Paper, Typography, styled } from "@mui/material";
import CustomizedSteppers from "./components/TokenFormLayout";

const FormRoot = styled(Paper)(() => ({
  padding: 30,
  borderRadius: 10,
  marginTop: 50,
  // backgroundColor: theme.palette.primary.main,
  // color: "white",
}));

const TokenPage = () => {
  return (
    <>
      <Grid container justifyContent={"center"}>
        <Typography variant="h5" mt={8}>
          Launch on base in seconds
        </Typography>
      </Grid>
      <FormRoot>
        <CustomizedSteppers />
      </FormRoot>
    </>
  );
};

export default TokenPage;
