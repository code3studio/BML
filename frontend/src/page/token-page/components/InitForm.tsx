import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Grid, TextField, Typography } from "@mui/material";

const defaultValues = {
  name: "",
  symbol: "",
  decimal: "",
  supply: "",
  maxBuy: "",
  initialLP: "",
};
const schema = z.object({
  name: z.string().nonempty("You must enter token name"),
});

const InitForm = () => {
  const { control, formState } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { errors } = formState;

  return (
    <>
      <div className="flex justify-center items-center mt-5">
        <Typography variant="h6">Token Info</Typography>
      </div>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3}>
              <Typography textAlign={"right"}>Name</Typography>
            </Grid>
            <Grid item md={6}>
              <TextField
                label="name"
                error={!!errors.name}
                helperText={errors?.name?.message}
                {...field}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        name="symbol"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3}>
              <Typography textAlign={"right"}>$Symbol</Typography>
            </Grid>
            <Grid item md={6}>
              <TextField
                label="$symbol"
                error={!!errors.symbol}
                helperText={errors?.symbol?.message}
                {...field}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        name="decimal"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3}>
              <Typography textAlign={"right"}>Decimal</Typography>
            </Grid>
            <Grid item md={6}>
              <TextField
                label="decimal"
                error={!!errors.decimal}
                helperText={errors?.decimal?.message}
                {...field}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        )}
      />
      <div className="flex justify-center items-center mt-5">
        <Typography variant="h6">Tokenomics</Typography>
      </div>
      <Controller
        name="supply"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3}>
              <Typography textAlign={"right"}>Supply</Typography>
            </Grid>
            <Grid item md={6}>
              <TextField
                label="supply"
                error={!!errors.supply}
                helperText={errors?.supply?.message}
                {...field}
                fullWidth
                required
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
            <Grid item md={3}>
              <Typography textAlign={"right"}>Max Buy</Typography>
            </Grid>
            <Grid item md={6}>
              <TextField
                label="max buy"
                error={!!errors.maxBuy}
                helperText={errors?.maxBuy?.message}
                {...field}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        name="initialLP"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3}>
              <Typography textAlign={"right"}>Initial LP</Typography>
            </Grid>
            <Grid item md={6}>
              <TextField
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
      />
    </>
  );
};

export default InitForm;
