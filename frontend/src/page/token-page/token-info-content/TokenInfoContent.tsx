import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//@ts-ignore
import _ from "lodash";

type Props = {};

interface IData {
  name?: string;
  symbol: string;
  decimals?: number;
  supply: string;
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

const TokenInfoContent = (_props: Props) => {
  const [more, setMore] = useState<boolean>(false);
  const [burn, setBurn] = useState<boolean>(false);
  const [fee, setFee] = useState<boolean>(false);
  const [mint, setMint] = useState<boolean>(false);
  const [schema, setSchema] = useState(
    z.object({
      supply: z.string().nonempty("You must enter total supply"),
      symbol: z.string().nonempty("You must enter token symbol"),
      name: z.string().optional(),
      decimals: z.number().optional(),
      burnRate: z.number().optional(),
      tradingFee: z.number().optional(),
    })
  );

  // Update the schema when checkbox states change
  useEffect(() => {
    const newSchema = z.object({
      supply: z.string().nonempty("You must enter total supply"),
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
      supply: "",
      burnRate: 0,
      tradingFee: 0,
    },
  });

  const { handleSubmit, control, formState, setValue } = methods;
  const { dirtyFields, isValid } = formState;

  const onSubmit = (data: IData) => {
    console.log("data==", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Root>
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
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  sx={{ mt: 1 }}
                  placeholder="0-99,999,999,999,999,999"
                />
              )}
            />
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"flex-end"}
              sx={{ cursor: "pointer" }}
              onClick={() => setMore(!more)}
            >
              <Typography>More</Typography>
              {more ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Box>
            <Collapse in={more}>
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
            </Collapse>

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
                        A percentage of tokens will be sent to the burn address
                        for each on-chain transfer
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
                        Allows the creator to issue additional tokens after the
                        token creation
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
            disabled={_.isEmpty(dirtyFields) || !isValid}
          >
            {" "}
            Create a token
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default TokenInfoContent;
