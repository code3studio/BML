import {
  Avatar,
  AvatarGroup,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Skeleton,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useConfig,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import custom_abi from "../../../../../smart_contract/customer_token.json";
import std_abi from "../../../../../smart_contract/std_token.json";
import custom_liquidity_abi from "../../../../../smart_contract/custom_liquidity_token.json";
import custom_mint_abi from "../../../../../smart_contract/custom_mint_token.json";
import uniswap_abi from "../../../../../smart_contract/uniswap_v2_pari.json";
import { parseEther } from "viem";
import loadingIcon from "../../../../../assets/loading.png";
import Chart from "./Chart";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import LaunchIcon from "@mui/icons-material/Launch";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import metamask from "../../../../../assets/mt.svg";
import { DEAD_ADDRESS, NETWORK } from "../../../../../constant";
import ethIcon from "../../../../../assets/crypto/eth@2x.png";
import {
  ContractContext,
  ContractContextType,
} from "../../../../../context/ContractProvider";
import { toast } from "react-toastify";
import {
  waitForTransactionReceipt,
  writeContract as writeCoreContract,
} from "@wagmi/core";
import { CreateTokenType } from "../../../../../types/generate";
import moment from "moment";

type Props = {
  open: boolean;
  handleClose: () => void;
  manageAddress: string;
  tokenType: "basic" | "custom" | "custom_mint" | "liq_mint";
  name: string;
  symbol: string;
  feeRatio: number;
  burn: number;
  totalSupply: number;
  teamAllocation: number;
  balance: number;
  liquidity: number;
  pairAddress: string;
  owner: string;
  select: CreateTokenType["select"];
  teamAddress: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
let count = 0;

const TokenManageDialog = ({
  open,
  handleClose,
  manageAddress,

  name,
  symbol,
  burn,
  feeRatio,
  teamAllocation,
  balance,
  totalSupply,
  pairAddress,
  owner,
  select,
  teamAddress,
}: Props) => {
  let tempData;
  const [fee, setFee] = useState<number>(0);
  const [burnRatio, setBurnRatio] = useState<number>(0);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [ethAmount, setEthAmount] = useState<number>(0);
  const [burnAmount, setBurnAmount] = useState<number>(0);
  const [mintAmount, setMintAmount] = useState<number>(0);
  const [alert, setAlert] = useState(false);
  const [burnLP, setBurnLP] = useState<number>(0);
  const { address } = useAccount();
  const [confirm, setConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const constConfig = useConfig();

  const context = React.useContext<ContractContextType | undefined>(
    ContractContext
  );
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  const { changeUpdate } = context;
  useEffect(() => {
    setBurnRatio(burn);
    setFee(feeRatio);
  }, [burn, feeRatio]);
  //@ts-ignore
  const { data }: any[] = useReadContract({
    address: manageAddress as any,
    abi: custom_liquidity_abi,
    functionName: "vestingSchedules",
    args: [teamAddress],
  });

  const { data: hash, writeContract, error } = useWriteContract();
  function processBigint(number: bigint) {
    return (BigInt(number) / 1000000000000000000n).toString();
  }
  const handleBurn = async () => {
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
    try {
      setLoading(true);
      //@ts-ignore
      const result = await writeCoreContract(constConfig, {
        address: manageAddress as any,
        abi: custom_liquidity_abi,
        functionName: "transfer",
        args: [manageAddress, parseEther(tokenAmount.toString())],
      });
      //@ts-ignore
      const trr = await waitForTransactionReceipt(constConfig, {
        hash: result,
      });
      //@ts-ignore
      const res = await writeCoreContract(constConfig, {
        address: manageAddress as any,
        abi: custom_liquidity_abi,
        functionName: "addLiquidity",
        args: [parseEther(tokenAmount.toString())],
        value: parseEther(ethAmount.toString()),
      });
      //@ts-ignore
      const tr = await waitForTransactionReceipt(constConfig, {
        hash: res,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      changeUpdate(true);
    }
    // const result = await writeContract(
    //   {
    //     address: manageAddress as any,
    //     abi: custom_liquidity_abi,
    //     functionName: "transfer",
    //     args: [manageAddress, parseEther(tokenAmount.toString())],
    //   },
    //   {
    //     onSuccess: (data) => {
    //       console.log("data==", data);
    //       // const { isLoading: isConfirming, isSuccess: isConfirmed } =
    //       //   useWaitForTransactionReceipt({
    //       //     hash: data,
    //       //   });

    //       // console.log("isLoading====", isConfirming, isConfirmed);
    //       // while (isConfirming) {
    //       //   console.log("isLoading==", isConfirming, isConfirmed);
    //       //   if (isConfirmed) break;
    //       // }

    //       // if (isConfirmed) {

    //       // }
    //     },
    //   }
    // );
  };
  function abbreviateString(str: string, maxLength = 5) {
    if (str.length <= maxLength) {
      return str; //
    }
    const firstPart = str.substring(0, maxLength);
    const lastPart = str.substring(str.length - maxLength);
    return `${firstPart} ... ${lastPart}`;
  }
  const handleMint = async () => {
    writeContract({
      address: manageAddress as any,
      abi: custom_mint_abi,
      functionName: "mint",
      args: [address, parseEther(mintAmount.toString())],
    });
  };

  const handleChangeBurnRate = async () => {
    writeContract({
      address: manageAddress as any,
      abi: custom_abi,
      functionName: "updateBurnRatio",
      args: [(burnRatio ? burnRatio * 100 : 0).toString()],
    });
  };
  const handleChangeFee = async () => {
    writeContract({
      address: manageAddress as any,
      abi: custom_abi,
      functionName: "updateFee",
      args: [(feeRatio ? feeRatio * 100 : 0).toString()],
    });
  };

  const handleLPBurn = async () => {
    writeContract({
      address: manageAddress as any,
      abi: custom_liquidity_abi,
      functionName: "removeLiquidity",
      args: [parseEther(burnLP.toString())],
    });
  };
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  changeUpdate(isConfirmed);
  const { data: liquidityAllocation } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: manageAddress as any,
        abi: custom_liquidity_abi,
        functionName: "balanceOf",
        args: [address],
      },
    ],
  });

  if (!pairAddress.includes("0x000000")) {
    const { data } = useReadContracts({
      allowFailure: false,
      contracts: [
        {
          address: pairAddress as any,
          abi: uniswap_abi,
          functionName: "getReserves",
        },
        {
          address: pairAddress as any,
          abi: uniswap_abi,
          functionName: "totalSupply",
        },
      ],
    });
    tempData = data;
  }
  useEffect(() => {
    if (error) {
      setAlert(true);
    }
  }, [error]);
  const handleCopyText = (address: string) => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        console.log("Text copied successfully");
      })
      .catch((err) => {
        console.error("Unable to copy text: ", err);
      });
  };
  const handleAddToken = async (
    tokenAddress: string,
    tokenSymbol: string,
    tokenDecimals: number
  ) => {
    //@ts-ignore
    if (window.ethereum) {
      try {
        //@ts-ignore
        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Currently, only ERC20 tokens are supported
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              // image: tokenImage,
            },
          },
        });

        if (wasAdded) {
          console.log("Token added!");
        } else {
          console.log("Token addition cancelled.");
        }
      } catch (error) {
        console.error("Error adding token:", error);
      }
    } else {
      console.log("MetaMask is not installed.");
    }
  };

  if (isConfirmed && hash) {
    count += 1;
    if (count == 1) {
      toast.success(
        <>
          <Grid container justifyContent={"center"} mt={2}>
            <Typography variant="subtitle1">Operation succeeded.</Typography>
          </Grid>
          <Grid container justifyContent={"center"} mt={2}>
            <Typography
              variant="subtitle1"
              component={"a"}
              href={`${NETWORK}tx/${hash}`}
              sx={{ color: "blue", textDecoration: "underline" }}
              target="_blank"
            >
              Transaction
            </Typography>
          </Grid>
        </>
      );
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: {} }}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Transition}
    >
      <IconButton
        size="small"
        sx={{ position: "absolute", top: 3, right: 3 }}
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle>{name} Token control panel</DialogTitle>
      <Box sx={{ width: "100%" }}>
        {owner == DEAD_ADDRESS && (
          <Typography textAlign={"center"} color={"green"}>
            The Contract is renounced. anymore edits can be made
          </Typography>
        )}
        <Collapse in={alert}>
          {/* {alert && ( */}
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {error?.message}
          </Alert>
          {/* )} */}
        </Collapse>
      </Box>
      <DialogContent>
        {select.includes("fee") ? (
          <Grid
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={5}>
              <TextField
                type="number"
                disabled={owner == DEAD_ADDRESS}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  const value = e.target.value;

                  setFee(value === "" ? NaN : Number(value));
                }}
                value={fee}
              />
            </Grid>
            <Grid item md={6}>
              <Button
                disabled={owner == DEAD_ADDRESS}
                onClick={handleChangeFee}
                fullWidth
                variant="contained"
              >
                Change Creator commissions
              </Button>
            </Grid>
          </Grid>
        ) : null}
        {select.includes("burn") && (
          <Grid
            container
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={2}
          >
            <Grid item md={5}>
              <TextField
                type="number"
                disabled={owner == DEAD_ADDRESS}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  const value = e.target.value;

                  setBurnRatio(value === "" ? NaN : Number(value));
                }}
                value={burnRatio}
              />
            </Grid>
            <Grid item md={6}>
              <Button
                onClick={handleChangeBurnRate}
                fullWidth
                variant="contained"
                disabled={owner == DEAD_ADDRESS}
              >
                Change Burn Rate Fee
              </Button>
            </Grid>
          </Grid>
        )}
        {select.includes("burn") && (
          <Grid
            container
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={2}
          >
            <Grid item md={5}>
              <TextField
                type="number"
                disabled={owner == DEAD_ADDRESS}
                // InputProps={{
                //   endAdornment: (
                //     <InputAdornment position="end">%</InputAdornment>
                //   ),
                // }}
                onChange={(e) => {
                  {
                    const value = e.target.value;

                    setBurnAmount(value === "" ? NaN : Number(value));
                  }
                }}
                value={burnAmount}
              />
            </Grid>
            <Grid item md={6}>
              <Button
                disabled={owner == DEAD_ADDRESS}
                onClick={handleBurn}
                fullWidth
                variant="contained"
              >
                Burn
              </Button>
            </Grid>
          </Grid>
        )}
        {select.includes("mint") && (
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
                  disabled={owner == DEAD_ADDRESS}
                  // InputProps={{
                  //   endAdornment: (
                  //     <InputAdornment position="end">%</InputAdornment>
                  //   ),
                  // }}
                  onChange={(e) => {
                    {
                      const value = e.target.value;

                      setMintAmount(value === "" ? NaN : Number(value));
                    }
                  }}
                  value={mintAmount}
                />
              </Grid>
              <Grid item md={6}>
                <Button
                  disabled={owner == DEAD_ADDRESS}
                  onClick={handleMint}
                  fullWidth
                  variant="contained"
                >
                  Mint
                </Button>
              </Grid>
            </Grid>
          </>
        )}
        <Divider sx={{ mt: 2 }} />
        {select.includes("liquidity") && (
          <>
            {pairAddress.includes("0x000000000") ? (
              <Grid
                container
                // justifyContent={"space-between"}
                mt={2}
                // alignItems={"center"}
              >
                <Grid item md={12}>
                  <Grid container flexDirection={"column"}>
                    {" "}
                    {liquidityAllocation && (
                      <TextField
                        disabled={owner == DEAD_ADDRESS}
                        helperText={`You can add a maximum of ${processBigint(
                          liquidityAllocation[0] as bigint
                        )} to the liquidity`}
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {symbol}
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          {
                            const value = e.target.value;

                            setTokenAmount(value === "" ? NaN : Number(value));
                          }
                        }}
                        value={tokenAmount}
                      />
                    )}
                    {liquidityAllocation && (
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        mb={2}
                        mt={0.5}
                      >
                        <Chip
                          label="20%"
                          disabled={owner == DEAD_ADDRESS}
                          onClick={() => {
                            setTokenAmount(
                              Number(
                                processBigint(liquidityAllocation[0] as bigint)
                              ) * 0.2
                            );
                          }}
                          color="info"
                          size="small"
                        />
                        <Chip
                          label="40%"
                          disabled={owner == DEAD_ADDRESS}
                          onClick={() => {
                            setTokenAmount(
                              Number(
                                processBigint(liquidityAllocation[0] as bigint)
                              ) * 0.4
                            );
                          }}
                          color="info"
                          size="small"
                        />
                        <Chip
                          label="60%"
                          disabled={owner == DEAD_ADDRESS}
                          onClick={() => {
                            setTokenAmount(
                              Number(
                                processBigint(liquidityAllocation[0] as bigint)
                              ) * 0.6
                            );
                          }}
                          color="info"
                          size="small"
                        />
                        <Chip
                          label="80%"
                          disabled={owner == DEAD_ADDRESS}
                          onClick={() => {
                            setTokenAmount(
                              Number(
                                processBigint(liquidityAllocation[0] as bigint)
                              ) * 0.8
                            );
                          }}
                          color="info"
                          size="small"
                        />
                        <Chip
                          label="100%"
                          disabled={owner == DEAD_ADDRESS}
                          onClick={() => {
                            setTokenAmount(
                              Number(
                                processBigint(liquidityAllocation[0] as bigint)
                              ) * 1
                            );
                          }}
                          color="info"
                          size="small"
                        />
                      </Box>
                    )}
                    <TextField
                      type="number"
                      disabled={owner == DEAD_ADDRESS}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">eth</InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        {
                          const value = e.target.value;

                          setEthAmount(value === "" ? NaN : Number(value));
                        }
                      }}
                      value={ethAmount}
                    />
                  </Grid>
                </Grid>
                <Grid item md={12}>
                  <Button
                    disabled={owner == DEAD_ADDRESS}
                    sx={{ mt: 2 }}
                    variant="contained"
                    fullWidth
                    onClick={handleAddLiquidity}
                  >
                    Add Liquidity
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <>
                <Grid
                  mt={2}
                  container
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Grid item>
                    <Grid container alignItems={"center"} columnGap={1}>
                      <Typography>
                        LP: {abbreviateString(pairAddress)}{" "}
                      </Typography>
                      <AvatarGroup>
                        <Avatar
                          src={ethIcon}
                          alt="tokenA"
                          sx={{ width: 20, height: 20 }}
                        />
                        <Avatar
                          src={ethIcon}
                          alt="tokenB"
                          sx={{ width: 20, height: 20 }}
                        />
                      </AvatarGroup>

                      <LaunchIcon
                        sx={{ cursor: "pointer", width: 12 }}
                        onClick={() => {
                          window.open(
                            `${NETWORK}token/${pairAddress}`,
                            "_blank"
                          );
                        }}
                      />
                      <ContentCopyIcon
                        onClick={() => {
                          handleCopyText(pairAddress);
                        }}
                        fontSize="small"
                        sx={{ cursor: "pointer", width: 12 }}
                      />
                      {tempData && (
                        <Tooltip title="Add the token to metamask">
                          <Box
                            width={14}
                            height={14}
                            sx={{
                              backgroundImage: `url(${metamask})`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleAddToken(pairAddress, `UNI-V2`, 18);
                            }}
                          />
                        </Tooltip>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">
                      {tempData && Number(processBigint(tempData[1] as bigint))}{" "}
                      <Typography display={"inline-block"}>UNI-V2</Typography>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mt={2}
                >
                  <Grid item md={5}>
                    <TextField
                      disabled={owner == DEAD_ADDRESS}
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">UNI-V2</InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        {
                          const value = e.target.value;

                          setBurnLP(value === "" ? NaN : Number(value));
                        }
                      }}
                      value={burnLP}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <Button
                      disabled={owner == DEAD_ADDRESS}
                      onClick={handleLPBurn}
                      fullWidth
                      variant="contained"
                    >
                      LP Burn
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
            <Divider sx={{ mt: 2 }} />
          </>
        )}
        {select.includes("team") ? (
          <>
            <Grid container justifyContent={"center"}>
              <Typography variant="subtitle1">Team Allocation</Typography>
            </Grid>
            {data?.length > 0 ? (
              <Grid container mt={2} spacing={1}>
                <Grid item container justifyContent={"space-between"}>
                  <Typography>Team Address:</Typography>
                  <Typography>{abbreviateString(teamAddress)}</Typography>
                </Grid>
                <Grid item container justifyContent={"space-between"}>
                  <Typography>Vesting amount:</Typography>
                  <Typography>
                    {" "}
                    {processBigint(data[0])} {symbol}
                  </Typography>
                </Grid>
                <Grid item container justifyContent={"space-between"}>
                  <Typography> Vesting Duration:</Typography>
                  <Typography>{Number(data[3]) / (24 * 3600)} days</Typography>
                </Grid>
                <Grid item container justifyContent={"space-between"}>
                  <Typography> Vesting Start Date:</Typography>
                  <Typography>
                    {moment
                      .unix(Number(data[2]))
                      .utc()
                      .format("DD, MM, YYYY, h:mm:ss (UTC)")}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Skeleton width={"200"} />
            )}
            <Divider sx={{ mt: 2 }} />
          </>
        ) : null}

        {owner == DEAD_ADDRESS ? (
          <Button sx={{ mt: 2 }} variant="contained" fullWidth disabled>
            {" "}
            The contract is renounced
          </Button>
        ) : (
          <Button
            sx={{ mt: 2 }}
            onClick={() => setConfirm(true)}
            variant="contained"
            fullWidth
          >
            {" "}
            Renounce Ownership
          </Button>
        )}

        <Chart
          teamAllocation={teamAllocation}
          owner={balance}
          liquidity={
            tempData
              ? /*@ts-ignore*/
                Number(processBigint(tempData[0][1] as bigint)) >
                /*@ts-ignore*/
                Number(processBigint(tempData[0][0] as bigint))
                ? /*@ts-ignore*/
                  Number(processBigint(tempData[0][1] as bigint))
                : /*@ts-ignore*/
                  Number(processBigint(tempData[0][0] as bigint))
              : 0
          }
          total={totalSupply}
        />
      </DialogContent>
      <Dialog
        open={isConfirming || loading}
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

      <Dialog open={confirm} maxWidth="xs" onClose={() => setConfirm(false)}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          Once a smart contract has been renounced, no further edits can be made
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ mr: 2 }}
            color="secondary"
            variant="contained"
            onClick={handleRenounce}
          >
            yes
          </Button>
          <Button variant="contained" onClick={() => setConfirm(false)}>
            no
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default TokenManageDialog;
