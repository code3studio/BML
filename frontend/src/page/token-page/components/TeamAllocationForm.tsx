import { Controller, useFormContext } from "react-hook-form";
import { GenerateParamType } from "../../../types/generate";
import { Divider, Grid, TextField, Typography } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
type Props = {};

const TeamAllocationForm = (_props: Props) => {
  const { control, formState } = useFormContext<Partial<GenerateParamType>>();
  const { errors } = formState;

  return (
    <>
      <Divider textAlign="left">Team & Marketing</Divider>
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
                Team Wallet Address
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
                Distribution Percentage(%)
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
      <Controller
        name="maxBuy"
        control={control}
        render={({}) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Unlock Time
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker label="Basic date time picker" />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}
      />
    </>
  );
};

export default TeamAllocationForm;
