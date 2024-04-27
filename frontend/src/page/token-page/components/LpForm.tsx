import { Divider, Grid, TextField, Typography } from "@mui/material";
import { GenerateParamType } from "../../../types/generate";
import { Controller, useFormContext } from "react-hook-form";

type Props = {};

const LpForm = (_props: Props) => {
  const { control, formState } = useFormContext<Partial<GenerateParamType>>();
  const { errors } = formState;

  return (
    <>
      <Divider textAlign="left">LP option</Divider>
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
                Liquidity Fee(%)
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
    </>
  );
};

export default LpForm;
