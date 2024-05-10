import { Box, Grid, Typography, styled } from "@mui/material";
import TokenCard from "./TokenCard";
import { CreateTokenResponseType } from "../../../../types/generate";

type Props = {
  tokens: CreateTokenResponseType[];
};
const Root = styled(Box)(() => ({
  padding: "30px 0px",
}));
const MyTokens = ({ tokens }: Props) => {
  return (
    <Root>
      <Typography variant="h5" mb={4}>
        MyToken List
      </Typography>
      <Grid container spacing={4}>
        {tokens.map((token, index) => (
          <Grid item md={3} sm={6} xs={12} key={index}>
            <TokenCard
              tokenAddress={token.tokenAddress}
              creatorAddress={token.creatorAddress}
              // @ts-ignore
              type={token.token_type}
            />
          </Grid>
        ))}
      </Grid>
    </Root>
  );
};

export default MyTokens;
