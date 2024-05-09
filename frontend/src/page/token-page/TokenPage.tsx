import { Grid, Typography } from "@mui/material";
import TokenInfoContent from "./token-info-content/TokenInfoContent";

const TokenPage = () => {
  return (
    <>
      <Grid container justifyContent={"center"}>
        <Typography variant="h5" mt={8} textAlign={"center"}>
          Create your own tokens with one click!
        </Typography>
      </Grid>
      <TokenInfoContent />
    </>
  );
};

export default TokenPage;
