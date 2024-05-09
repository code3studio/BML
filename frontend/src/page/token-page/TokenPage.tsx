import { Grid, Paper, Typography, styled } from "@mui/material";
import TokenInfoContent from "./token-info-content/TokenInfoContent";

const FormRoot = styled(Paper)(() => ({
  padding: 30,
  borderRadius: 10,
  marginTop: 50,
  // display: "flex",
  // justifyContent: "center",
  // backgroundColor: theme.palette.primary.main,
  // color: "white",
}));

const TokenPage = () => {
  return (
    <>
      <Grid container justifyContent={"center"}>
        <Typography variant="h5" mt={8} textAlign={"center"}>
          Create your own tokens with one click!
        </Typography>
      </Grid>
      <FormRoot>
        <TokenInfoContent />
      </FormRoot>
    </>
  );
};

export default TokenPage;
