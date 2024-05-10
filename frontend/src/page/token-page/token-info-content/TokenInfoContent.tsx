import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import abi from "../../../smart_contract/template.json";
//@ts-ignore
import _, { result } from "lodash";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseEther } from "viem";
import MyTokens from "./my-tokens";
import { createContract, getTokens } from "../../../services/api";
import { CreateTokenResponseType } from "../../../types/generate";

type Props = {};

interface IData {
  name?: string;
  symbol: string;
  decimals?: number;
  supply: number;
  burnRate?: number;
  tradingFee?: number;
}

const Root = styled(Box)(() => ({
  maxWidth: 450,
  padding: 8,
}));

const BoxRoot = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  padding: 16,
  background: theme.palette.mode === "light" ? grey[100] : grey[800],
  marginTop: 12,
}));

const PercentageText = styled(TextField)(({ theme }) => ({
  width: "16ch",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const FormRoot = styled(Paper)(() => ({
  padding: 30,
  borderRadius: 10,
  marginTop: 50,
  // display: "flex",
  // justifyContent: "center",
  // backgroundColor: theme.palette.primary.main,
  // color: "white",
}));

const TokenInfoContent = (_props: Props) => {
  const { data: hash, writeContract, error } = useWriteContract();
  const { address } = useAccount();
  const [burn, setBurn] = useState<boolean>(false);
  const [fee, setFee] = useState<boolean>(false);
  const [mint, setMint] = useState<boolean>(false);
  const [type, setType] = useState<"basic" | "custom" | "custom_mint">("basic");
  const [schema, setSchema] = useState(
    z.object({
      supply: z.number(),
      symbol: z.string().nonempty("You must enter token symbol"),
      name: z.string().optional(),
      decimals: z.number().optional(),
      burnRate: z.number().optional(),
      tradingFee: z.number().optional(),
    })
  );
  const [tokens, setTokens] = useState<CreateTokenResponseType[]>([]);

  // Update the schema when checkbox states change
  useEffect(() => {
    const newSchema = z.object({
      supply: z.number(),
      symbol: z.string().nonempty("You must enter token symbol"),
      name: z.string().optional(),
      decimals: z.number().optional(),
      burnRate: burn ? z.number() : z.number().optional(),
      tradingFee: fee ? z.number() : z.number().optional(),
    });
    setSchema(newSchema as any);
  }, [burn, fee]);

  const methods = useForm<IData>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: 18,
      supply: NaN,
      burnRate: 0,
      tradingFee: 0,
    },
  });

  const { handleSubmit, control, formState, setValue, reset } = methods;
  const { dirtyFields, isValid } = formState;

  const onSubmit = async (data: IData) => {
    console.log("data==", data, hash);
    if (burn && fee && mint) {
      console.log("createCustomMintableERC20");
      setType("custom_mint");
      writeContract({
        address: "0x7D8E447c6f5bC6FD55cdF67157388b28027Ab01D",
        abi,
        functionName: "createCustomMintableERC20",
        args: [
          parseEther(data.supply.toString()), // totalSupply: 100 million tokens
          data.name ? data.name : data.symbol, // name: 'ExampleToken'
          data.symbol, // symbol: 'EXM'
          data.decimals?.toString(),
          (data.burnRate ? data.burnRate * 100 : 0).toString(),
          (data.tradingFee ? data.tradingFee * 100 : 0).toString(),
          address,

          // decimals: typically 18, like Ethereum
        ],
        value: parseEther("0.018"),
      });
    } else if (!burn && !fee && !mint) {
      console.log("createStdERC20");
      setType("basic");
      writeContract({
        address: "0x7D8E447c6f5bC6FD55cdF67157388b28027Ab01D",
        abi,
        functionName: "createStdERC20",
        args: [
          parseEther(data.supply.toString()), // totalSupply: 100 million tokens
          data.name ? data.name : data.symbol, // name: 'ExampleToken'
          data.symbol, // symbol: 'EXM'
          data.decimals?.toString(),
          // decimals: typically 18, like Ethereum
        ],
        value: parseEther("0.018"),
      });
    } else {
      console.log("createCustomERC20");
      setType("custom");

      writeContract({
        address: "0x7D8E447c6f5bC6FD55cdF67157388b28027Ab01D",
        abi,
        functionName: "createCustomERC20",
        args: [
          parseEther(data.supply.toString()), // totalSupply: 100 million tokens
          data.name ? data.name : data.symbol, // name: 'ExampleToken'
          data.symbol, // symbol: 'EXM'
          data.decimals?.toString(),
          (data.burnRate ? data.burnRate * 100 : 0).toString(),
          (data.tradingFee ? data.tradingFee * 100 : 0).toString(),
          address,

          // decimals: typically 18, like Ethereum
        ],
        value: parseEther("0.018"),
      });
    }
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data,
  } = useWaitForTransactionReceipt({
    hash,
  });
  console.log("result===", data, isConfirmed, isConfirming, error);

  useEffect(() => {
    const fetchData = async () => {
      if (data?.logs[0].address && isConfirmed && address) {
        try {
          await createContract({
            tokenAddress: data.logs[0].address as string,
            creatorAddress: address as string,
            tokenType: type,
          });
          reset();
          //@ts-ignore
          setTokens([
            ...tokens,
            {
              token_type: type,
              tokenAddress: data.logs[0].address,
              creatorAddress: address,
            },
          ]);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData(); // Call the async function immediately
  }, [data?.logs[0].address, isConfirmed, type, address, reset]);

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        getUserTokens(address);
      } else {
        setTokens([]);
      }
    };
    fetchData();
  }, [address]);

  const getUserTokens = async (address: string) => {
    try {
      let res = await getTokens(address);
      setTokens(res.data as CreateTokenResponseType[]);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <FormProvider {...methods}>
      <FormRoot>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Root>
              {error && <Alert severity="error">{error.message}</Alert>}
              <Typography variant="h6">Enter Token Parameters</Typography>
              <Typography sx={{ mt: 2 }}>Token Symbol</Typography>

              <Controller
                name="symbol"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    sx={{ mt: 1 }}
                    placeholder="1-16 Characters"
                  />
                )}
              />
              <Typography sx={{ mt: 2 }}>Token Supply</Typography>

              <Controller
                name="supply"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    type="number"
                    {...field}
                    fullWidth
                    sx={{ mt: 1 }}
                    onChange={(e) => onChange(Number(e.target.value))}
                    placeholder="0-99,999,999,999,999,999"
                  />
                )}
              />
              {/* <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"flex-end"}
                sx={{ cursor: "pointer" }}
                onClick={() => setMore(!more)}
              >
                <Typography>More</Typography>
                {more ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </Box> */}
              {/* <Collapse in={more}> */}
              <Typography sx={{ mt: 2 }}>Token Name</Typography>

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    sx={{ mt: 1 }}
                    placeholder="1-64 Characters"
                  />
                )}
              />
              <Typography sx={{ mt: 2 }}>Decimals</Typography>
              <Controller
                name="decimals"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    onChange={(e) => onChange(Number(e.target.value))}
                    type="number"
                    {...field}
                    fullWidth
                    sx={{ mt: 1 }}
                    placeholder="number"
                  />
                )}
              />
              {/* </Collapse> */}

              <Box mt={4}>
                <Typography variant="h6">Special Features</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={burn}
                        onChange={(e) => {
                          e.target.checked
                            ? setValue("burnRate", 0.1)
                            : setValue("burnRate", 0);
                          setBurn(e.target.checked);
                        }}
                      />
                    }
                    label="Burn"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={fee}
                        onChange={(e) => {
                          e.target.checked
                            ? setValue("tradingFee", 0.1)
                            : setValue("tradingFee", 0);
                          setFee(e.target.checked);
                        }}
                      />
                    }
                    label="Trading Fees"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={mint}
                        onChange={(e) => setMint(e.target.checked)}
                      />
                    }
                    label="Supports Supply Increase"
                  />
                </FormGroup>
                {/* {burn ? ( */}
                <Collapse in={burn}>
                  <BoxRoot>
                    <Grid container alignItems={"center"}>
                      <Grid item xs>
                        <Typography>Burn:</Typography>
                        <Typography variant="caption">
                          A percentage of tokens will be sent to the burn
                          address for each on-chain transfer
                        </Typography>
                      </Grid>
                      <Grid item xs="auto">
                        <Controller
                          name="burnRate"
                          control={control}
                          render={({ field: { onChange, ...field } }) => (
                            <PercentageText
                              type="number"
                              onChange={(e) => onChange(Number(e.target.value))}
                              {...field}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </BoxRoot>
                </Collapse>

                <Collapse in={fee}>
                  <BoxRoot>
                    <Grid container alignItems={"center"}>
                      <Grid item xs>
                        <Typography>Trading Fee:</Typography>
                        <Typography variant="caption">
                          A percentage of tokens will be sent to the creator's
                          address for each on-chain transfer
                        </Typography>
                      </Grid>
                      <Grid item xs="auto">
                        <Controller
                          name="tradingFee"
                          control={control}
                          render={({ field: { onChange, ...field } }) => (
                            <PercentageText
                              type="number"
                              onChange={(e) => onChange(Number(e.target.value))}
                              {...field}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </BoxRoot>
                </Collapse>

                <Collapse in={mint}>
                  <BoxRoot>
                    <Grid container alignItems={"center"}>
                      <Grid item xs>
                        <Typography>Supports Supply Increase:</Typography>
                        <Typography variant="caption">
                          Allows the creator to issue additional tokens after
                          the token creation
                        </Typography>
                      </Grid>
                      <Grid item xs="auto">
                        {/* <TextField
                sx={{ width: "16ch" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              /> */}
                      </Grid>
                    </Grid>
                  </BoxRoot>
                </Collapse>
              </Box>
            </Root>
          </div>
          <Divider sx={{ my: 4 }} />
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box display={"flex"}>
              <Typography
                sx={{
                  wordBreak: "break-word",
                  minWidth: "10px",
                  display: "inline-block",
                }}
                variant="body2"
              >
                {" "}
                Service Fees 0.002 ETH
              </Typography>
            </Box>

            <Button
              sx={{ float: "right", minWidth: 160 }}
              variant="contained"
              type="submit"
              disabled={_.isEmpty(dirtyFields) || !isValid || isConfirming}
            >
              {" "}
              {isConfirming && (
                <CircularProgress
                  color="inherit"
                  sx={{
                    width: "20px !important",
                    height: "20px !important",
                    mr: 1,
                  }}
                />
              )}
              Create a token
            </Button>
          </Box>
        </form>
      </FormRoot>
      {tokens.length > 0 && <MyTokens tokens={tokens} />}
    </FormProvider>
  );
};

export default TokenInfoContent;
