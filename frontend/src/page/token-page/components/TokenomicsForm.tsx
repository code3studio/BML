import {
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { GenerateParamType } from "../../../types/generate";
import TeamAllocationForm from "./TeamAllocationForm";
import LpForm from "./LpForm";

type Props = {};

const TokenomicsForm = (_props: Props) => {
  const { control, formState, watch } =
    useFormContext<Partial<GenerateParamType>>();
  const { errors } = formState;

  const mintable = watch("mintable");
  const supply = watch("supply");
  console.log("supply==", typeof supply);
  return (
    <>
      <div className="flex justify-center items-center mt-5">
        <Typography variant="h6">Tokenomics</Typography>
      </div>
      <Controller
        name="supply"
        control={control}
        render={({ field: { onChange, ...field } }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Initial Supply
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                type="number"
                label="supply"
                error={!!errors.supply}
                helperText={errors?.supply?.message}
                {...field}
                fullWidth
                required
                onChange={(e) => onChange(Number(e.target.value))}
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        name="maxBuy"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Max Transaction Amount
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                type="number"
                label="max buy"
                error={!!errors.maxBuy}
                helperText={errors?.maxBuy?.message}
                {...field}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      />
      {/* <Controller
        name="initialLP"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Initial LP
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                type="number"
                label="Initial LP"
                error={!!errors.initialLP}
                helperText={errors?.initialLP?.message}
                {...field}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        )}
      /> */}
      <Controller
        name="mintable"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <FormControlLabel
                control={<Checkbox {...field} />}
                label="mintable"
              />
            </Grid>
            <Grid item md={6} sm={12} xs={12}></Grid>
          </Grid>
        )}
      />
      {mintable && (
        <>
          <Controller
            name="totalSupply"
            control={control}
            render={({ field }) => (
              <Grid
                className="mt-6"
                container
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Grid item md={3} sm={12} xs={12}>
                  <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                    Total Supply
                  </Typography>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    type="number"
                    label="Total Supply"
                    error={!!errors.totalSupply}
                    helperText={errors?.totalSupply?.message}
                    {...field}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            )}
          />
        </>
      )}
      <Divider textAlign="left">Taxes & Fees </Divider>
      <Controller
        name="redistributionTax"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Redistribution Tax(%)
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                type="number"
                label="Redistribution Tax"
                error={!!errors.redistributionTax}
                helperText={errors?.redistributionTax?.message}
                {...field}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        name="liquidityFee"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Liquidity Fee(%)
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                type="number"
                label="Liquidity Fee"
                error={!!errors.liquidityFee}
                helperText={errors?.liquidityFee?.message}
                {...field}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        name="charityFee"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Charity Fee(%)
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                type="number"
                label="max buy"
                error={!!errors.charityFee}
                helperText={errors?.charityFee?.message}
                {...field}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        name="marketingFee"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Marketing Fee(%)
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                type="number"
                label="Marketing Fee"
                error={!!errors.marketingFee}
                helperText={errors?.marketingFee?.message}
                {...field}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        name="burnFee"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Burn Fee(%)
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                type="number"
                label="Burn Fee"
                error={!!errors.burnFee}
                helperText={errors?.burnFee?.message}
                {...field}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      />
      <TeamAllocationForm />
      <LpForm />
    </>
  );
};

export default TokenomicsForm;
