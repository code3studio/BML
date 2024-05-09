import {
  Box,
  Collapse,
  Grid,
  Skeleton,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import metamask from "../../../../../assets/mt.svg";
import { NETWORK } from "../../../../../constant";
import { blue, grey } from "@mui/material/colors";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAccount, useReadContract } from "wagmi";
import abi from "../../../../../smart_contract/customer_token.json";
type Props = {
  tokenAddress: string;
  creatorAddress: string;
  tokenSymbol: string;
  totalSupply: string;
  tokenName: string;
  burnRate: string;
};

const Root = styled(Box)(() => ({
  borderRadius: 6,
}));
const TokenCard = ({ tokenAddress, burnRate }: Props) => {
  const theme = useTheme();
  const [more, setMore] = useState<boolean>(false);
  const { address } = useAccount();

  const { data: balance, error } = useReadContract({
    address: tokenAddress as any,
    abi,
    functionName: "balanceOf",
    args: [address],
  });
  const { data: creatorAddress } = useReadContract({
    address: tokenAddress as any,
    abi,
    functionName: "_OWNER_",
  });
  const { data: tokenName } = useReadContract({
    address: tokenAddress as any,
    abi,
    functionName: "name",
  });
  const { data: tokenSymbol } = useReadContract({
    address: tokenAddress as any,
    abi,
    functionName: "symbol",
  });
  const { data: totalSupply } = useReadContract({
    address: tokenAddress as any,
    abi,
    functionName: "totalSupply",
  });
  console.log("error", error, creatorAddress);
  function abbreviateString(str: string, maxLength = 5) {
    if (str.length <= maxLength) {
      return str; //
    }
    const firstPart = str.substring(0, maxLength);
    const lastPart = str.substring(str.length - maxLength);
    return `${firstPart} ... ${lastPart}`;
  }

  function formatNumber(number: number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "k";
    } else {
      return number.toString();
    }
  }
  function processBigint(number: bigint) {
    return (BigInt(number) / 1000000000000000000n).toString();
  }

  return (
    <Root>
      <Box
        position={"relative"}
        padding={2}
        bgcolor={blue[50]}
        borderRadius={"8px 8px 0px 0px"}
      >
        <Box display={"flex"} columnGap={2}>
          <Typography
            variant="body2"
            component={"a"}
            href={`${NETWORK}token/${tokenAddress}`}
            target="_blank"
          >
            {abbreviateString(tokenAddress)}
          </Typography>
          <LaunchIcon
            sx={{ cursor: "pointer", width: 12 }}
            onClick={() => {
              window.open(`${NETWORK}token/${tokenAddress}`, "_blank");
            }}
          />
          <ContentCopyIcon
            fontSize="small"
            sx={{ cursor: "pointer", width: 12 }}
          />
          <img
            src={metamask}
            alt="metamask"
            width={14}
            style={{ cursor: "pointer" }}
          />
        </Box>
        <Box mt={4}>
          <Grid container>
            <Grid item xs={6}>
              <Box>
                {tokenSymbol ? (
                  <Typography variant="h4">{tokenSymbol as string}</Typography>
                ) : (
                  <Skeleton width={80} component={"h4"} />
                )}
                <Typography variant="caption">Token Symbol</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                {totalSupply ? (
                  <Typography variant="h4">
                    {formatNumber(Number(processBigint(totalSupply as bigint)))}
                  </Typography>
                ) : (
                  <Skeleton width={80} component={"h4"} />
                )}
                <Typography variant="caption">Total Supply</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box
          onClick={() => setMore(!more)}
          width={30}
          height={30}
          borderRadius={"50%"}
          position={"absolute"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          left={"45%"}
          bottom={-16}
          sx={{ borderRadius: "50%", borderWidth: 1, cursor: "pointer" }}
          bgcolor={blue[50]}
          borderColor={theme.palette.mode === "light" ? "white" : grey[700]}
          zIndex={1000}
        >
          {more ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Box>
      </Box>
      <Collapse in={more}>
        <Box p={4} bgcolor={grey[100]} borderRadius={"0px 0px 8px 8px"}>
          <Typography variant="caption">Token Name</Typography>
          {/*@ts-ignore*/}
          {tokenName ? (
            <Typography variant="subtitle1">{tokenName.toString()}</Typography>
          ) : (
            <Skeleton variant="text" width={40} />
          )}

          <Box mt={2}>
            <Typography variant="caption">Created by</Typography>
            <Box display={"flex"} columnGap={1} alignItems={"center"}>
              <Typography variant="subtitle1">
                {/*@ts-ignore*/}
                {abbreviateString(creatorAddress ?? "0")}
              </Typography>
              <LaunchIcon
                sx={{ width: 12, cursor: "pointer" }}
                onClick={() => {
                  window.open(`${NETWORK}address/${creatorAddress}`, "_blank");
                }}
              />
              <ContentCopyIcon sx={{ width: 12, cursor: "pointer" }} />
            </Box>
          </Box>
          <Box mt={2}>
            <Typography variant="caption">Holders</Typography>
            <Box display={"flex"} columnGap={1} alignItems={"center"}>
              <Typography variant="subtitle1">Token Holders Chart</Typography>
              <LaunchIcon
                sx={{ width: 12, cursor: "pointer" }}
                onClick={() => {
                  window.open(
                    `${NETWORK}token/tokenholderchart/${tokenAddress}`,
                    "_blank"
                  );
                }}
              />
            </Box>
          </Box>
          <Box mt={2}>
            <Typography variant="caption">Balance</Typography>
            <Typography variant="subtitle1">
              {/*@ts-ignore*/}
              {balance ? processBigint(balance as bigint) : 0}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="caption">Special Features</Typography>
            <Typography variant="subtitle1">Burn {burnRate} %</Typography>
          </Box>
        </Box>
      </Collapse>
    </Root>
  );
};

export default TokenCard;
