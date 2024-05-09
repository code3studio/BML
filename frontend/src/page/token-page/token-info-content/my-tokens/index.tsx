import { Box, Grid, Typography, styled } from "@mui/material";
import TokenCard from "./TokenCard";

type Props = {
  tokenAddress: string;
};
const Root = styled(Box)(() => ({
  padding: "30px 0px",
}));
const MyTokens = ({ tokenAddress }: Props) => {
  return (
    <Root>
      <Typography variant="h5" mb={4}>
        MyToken List
      </Typography>
      <Grid container spacing={4}>
        <Grid item md={3}>
          <TokenCard
            tokenAddress={tokenAddress}
            tokenName="TTT"
            tokenSymbol="TT"
            totalSupply="1000000"
            creatorAddress={"0xC5e6E79bc2CD1501C21C05A0C6046E92272c6d68"}
            burnRate={"0.1"}
          />
        </Grid>
      </Grid>
    </Root>
  );
};

export default MyTokens;
