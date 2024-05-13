import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Slide,
  TextField,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import custom_abi from "../../../../../smart_contract/customer_token.json";
import std_abi from "../../../../../smart_contract/std_token.json";
import custom_mint_abi from "../../../../../smart_contract/custom_mint_token.json";
import custom_liquidity_abi from "../../../../../smart_contract/custom_liquidity_token.json";
import { parseEther } from "viem";
import loadingIcon from "../../../../../assets/loading.png";

type Props = {
  open: boolean;
  handleClose: () => void;
  manageAddress: string;
  tokenType: "basic" | "custom" | "custom_mint" | "liq_mint";
  name: string;
  symbol: string;
  feeRatio: number;
  burn: number;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TokenManageDialog = ({
  open,
  handleClose,
  manageAddress,
  tokenType,
  name,
  symbol,
  burn,
  feeRatio,
}: Props) => {
  const [fee, setFee] = useState<number>(0);
  const [burnRatio, setBurnRatio] = useState<number>(0);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [ethAmount, setEthAmount] = useState<number>(0);
  const [burnAmount, setBurnAmount] = useState<number>(0);
  const [mintAmount, setMintAmount] = useState<number>(0);
  useEffect(() => {
    setBurnRatio(burn);
    setFee(feeRatio);
  }, [burn, feeRatio]);
  const { data: hash, writeContract, error } = useWriteContract();

  const handleBurn = async () => {
    console.log("bbb==", burnAmount);
    if (burnAmount === 0) return;
    writeContract({
      address: manageAddress as any,
      abi: custom_abi,
      functionName: "burn",
      args: [parseEther(burnAmount.toString())],
    });
  };

  const handleRenounce = async () => {
    writeContract({
      address: manageAddress as any,
      abi: std_abi,
      functionName: "renounceOwnership",
    });
  };
  const handleAddLiquidity = async () => {
    writeContract({
      address: manageAddress as any,
      abi: custom_liquidity_abi,
      functionName: "addLiquidity",
      args: [tokenAmount, ethAmount],
      //   value: (ethAmount),
    });
  };
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data,
  } = useWaitForTransactionReceipt({
    hash,
  });
  console.log("data==", data, error);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { p: 2 } }}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Transition}
    >
      <DialogTitle>{name} Token control panel</DialogTitle>
      <DialogContent>
        {tokenType !== "basic" && (
          <Grid
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={5}>
              <TextField
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                onChange={(e) => setFee(Number(e.target.value))}
                value={fee}
              />
            </Grid>
            <Grid item md={6}>
              <Button fullWidth variant="contained">
                Change Trading Fee
              </Button>
            </Grid>
          </Grid>
        )}
        {tokenType !== "basic" && (
          <Grid
            container
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={2}
          >
            <Grid item md={5}>
              <TextField
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                onChange={(e) => setBurnRatio(Number(e.target.value))}
                value={burnRatio}
              />
            </Grid>
            <Grid item md={6}>
              <Button fullWidth variant="contained">
                Change Burn Rate Fee
              </Button>
            </Grid>
          </Grid>
        )}
        {tokenType !== "basic" && (
          <Grid
            container
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={2}
          >
            <Grid item md={5}>
              <TextField
                type="number"
                // InputProps={{
                //   endAdornment: (
                //     <InputAdornment position="end">%</InputAdornment>
                //   ),
                // }}
                onChange={(e) => setBurnAmount(Number(e.target.value))}
                value={burnAmount}
              />
            </Grid>
            <Grid item md={6}>
              <Button onClick={handleBurn} fullWidth variant="contained">
                Burn
              </Button>
            </Grid>
          </Grid>
        )}
        {tokenType === "custom_mint" && (
          <>
            <Divider sx={{ mt: 2 }} />
            <Grid
              container
              alignItems={"center"}
              justifyContent={"space-between"}
              mt={2}
            >
              <Grid item md={5}>
                <TextField
                  type="number"
                  // InputProps={{
                  //   endAdornment: (
                  //     <InputAdornment position="end">%</InputAdornment>
                  //   ),
                  // }}
                  onChange={(e) => setMintAmount(Number(e.target.value))}
                  value={mintAmount}
                />
              </Grid>
              <Grid item md={6}>
                <Button fullWidth variant="contained">
                  Mint
                </Button>
              </Grid>
            </Grid>
          </>
        )}
        <Divider sx={{ mt: 2 }} />
        {tokenType == "liq_mint" && (
          <>
            <Grid
              container
              justifyContent={"space-between"}
              mt={2}
              alignItems={"center"}
            >
              <Grid item md={5}>
                <Grid container flexDirection={"column"} rowGap={2}>
                  <TextField
                    type="number"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">{symbol}</InputAdornment>
                      ),
                    }}
                    onChange={(e) => setTokenAmount(Number(e.target.value))}
                    value={tokenAmount}
                  />
                  <TextField
                    type="number"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">eth</InputAdornment>
                      ),
                    }}
                    onChange={(e) => setEthAmount(Number(e.target.value))}
                    value={ethAmount}
                  />
                </Grid>
              </Grid>
              <Grid item md={6}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleAddLiquidity}
                >
                  Add Liquidity
                </Button>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 2 }} />
          </>
        )}
        {/* {tokenType == "liq_mint" && (
          <Grid
            container
            justifyContent={"space-between"}
            mt={2}
            alignItems={"center"}
          >
            <Grid item md={5}>
              <Grid container flexDirection={"column"} rowGap={2}>
                <TextField />
                <TextField />
              </Grid>
            </Grid>
            <Grid item md={6}>
              <Button variant="contained" fullWidth>
                Add Liquidity
              </Button>
            </Grid>
          </Grid>
        )}
        <Divider sx={{ mt: 2 }} /> */}
        <Button
          sx={{ mt: 2 }}
          onClick={handleRenounce}
          variant="contained"
          fullWidth
        >
          {" "}
          Renounce Ownership
        </Button>
      </DialogContent>
      <Dialog
        open={isConfirming}
        PaperProps={{
          sx: {
            background: "transparent",
            overflow: "hidden",
            boxShadow: "none",
          },
        }}
      >
        <img
          src={loadingIcon}
          style={{ animation: "rotation 2s infinite linear" }}
        />
      </Dialog>
    </Dialog>
  );
};

export default TokenManageDialog;
