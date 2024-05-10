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
import { useReadContracts } from "wagmi";
import custom_abi from "../../../../../smart_contract/customer_token.json";
import std_abi from "../../../../../smart_contract/std_token.json";
import custom_mint_abi from "../../../../../smart_contract/custom_mint_token.json";
import { CreateTokenType } from "../../../../../types/generate";
type Props = {
  tokenAddress: string;
  creatorAddress: string;
  type: CreateTokenType["tokenType"];
};

const Root = styled(Box)(() => ({
  borderRadius: 6,
}));
const TokenCard = ({ tokenAddress, creatorAddress, type }: Props) => {
  const theme = useTheme();
  const [more, setMore] = useState<boolean>(false);
  let tempData;
  if (type === "basic") {
    const { data } = useReadContracts({
      allowFailure: false,
      contracts: [
        {
          address: tokenAddress as any,
          abi: std_abi,
          functionName: "decimals",
        },
        {
          address: tokenAddress as any,
          abi: std_abi,
          functionName: "symbol",
        },
        {
          address: tokenAddress as any,
          abi: std_abi,
          functionName: "name",
        },
        {
          address: tokenAddress as any,
          abi: std_abi,
          functionName: "totalSupply",
        },
        {
          address: tokenAddress as any,
          abi: std_abi,
          functionName: "balanceOf",
          args: [creatorAddress],
        },
      ],
    });
    tempData = data;
  }
  if (type === "custom") {
    const { data } = useReadContracts({
      allowFailure: false,
      contracts: [
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "decimals",
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "symbol",
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "name",
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "totalSupply",
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "balanceOf",
          args: [creatorAddress],
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "tradeBurnRatio",
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "tradeFeeRatio",
        },
      ],
    });
    tempData = data;
  }
  if (type === "custom_mint") {
    const { data } = useReadContracts({
      allowFailure: false,
      contracts: [
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "decimals",
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "symbol",
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "name",
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "totalSupply",
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "balanceOf",
          args: [creatorAddress],
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "tradeBurnRatio",
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "tradeFeeRatio",
        },
      ],
    });
    tempData = data;
  }

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
                {tempData && tempData[1] ? (
                  <Typography variant="h4">{tempData[1] as string}</Typography>
                ) : (
                  <Skeleton width={80} component={"h4"} />
                )}
                <Typography variant="caption">Token Symbol</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                {tempData && tempData[3] ? (
                  <Typography variant="h4">
                    {formatNumber(Number(processBigint(tempData[3] as bigint)))}
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
          {tempData && tempData[2] ? (
            <Typography variant="subtitle1">
              {tempData[2].toString()}
            </Typography>
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
              {tempData && tempData[4]
                ? processBigint(tempData[4] as bigint)
                : 0}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="caption">Special Features</Typography>
            {(tempData && tempData[5]) || (tempData && tempData[6]) ? (
              <Grid container columnGap={3}>
                {tempData && tempData[5] ? (
                  <Typography variant="subtitle1">
                    Burn {(Number(tempData[5]) / 100).toString()} %
                  </Typography>
                ) : (
                  ""
                )}
                {tempData && tempData[6] ? (
                  <Typography variant="subtitle1">
                    Fee {(Number(tempData[6]) / 100).toString()} %
                  </Typography>
                ) : (
                  ""
                )}
              </Grid>
            ) : (
              <Typography variant="subtitle1"> No </Typography>
            )}
          </Box>
        </Box>
      </Collapse>
    </Root>
  );
};

export default TokenCard;
