import { Box, Grid, Typography, styled } from "@mui/material";
import TokenCard from "./TokenCard";
import { CreateTokenResponseType } from "../../../../types/generate";
import { useMemo } from "react";

type Props = {
  tokens: CreateTokenResponseType[];
};
const Root = styled(Box)(() => ({
  padding: "30px 0px",
}));
const MyTokens = ({ tokens }: Props) => {
  const tokenList: CreateTokenResponseType[] = useMemo(() => {
    const uniqueArray = tokens.reduce((accumulator, current) => {
      if (
        !accumulator.some(
          (item: CreateTokenResponseType) =>
            item.tokenAddress === current.tokenAddress
        )
      ) {
        //@ts-ignore
        accumulator.push(current as any);
      }
      return accumulator;
    }, []);
    return uniqueArray;
  }, [tokens]);
  return (
    <Root>
      <Typography variant="h5" mb={4}>
        MyToken List: {tokenList.length}
      </Typography>
      <Grid container spacing={4}>
        {tokenList.map((token, index) => (
          <Grid item md={3} sm={6} xs={12} key={index}>
            <TokenCard
              tokenAddress={token.tokenAddress}
              creatorAddress={token.creatorAddress}
              // @ts-ignore
              type={token.token_type}
              select={token.select}
            />
          </Grid>
        ))}
      </Grid>
    </Root>
  );
};

export default MyTokens;
