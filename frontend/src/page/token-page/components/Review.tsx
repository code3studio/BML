import { Grid, Typography } from "@mui/material";
import { GenerateParamType } from "../../../types/generate";

type Props = {
  data: Partial<GenerateParamType>;
};

const Review = ({ data }: Props) => {
  function abbreviateString(str: string, maxLength = 5) {
    if (str.length <= maxLength) {
      return str; //
    }
    const firstPart = str.substring(0, maxLength);
    const lastPart = str.substring(str.length - maxLength);
    return `${firstPart} ... ${lastPart}`;
  }
  return (
    <Grid container justifyContent={"center"}>
      <Grid item md={4}>
        <Grid
          container
          justifyContent={"space-between"}
          mt={8}
          alignItems={"center"}
        >
          <Typography>Name</Typography>
          <Typography>{data.name}</Typography>
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          mt={4}
          alignItems={"center"}
        >
          <Typography>Symbol</Typography>
          <Typography>{data.symbol}</Typography>
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          mt={4}
          alignItems={"center"}
        >
          <Typography>Decimal</Typography>
          <Typography>{data.decimal}</Typography>
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          mt={4}
          alignItems={"center"}
        >
          <Typography>Supply</Typography>
          <Typography>{data.supply}</Typography>
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          mt={4}
          alignItems={"center"}
        >
          <Typography>Max Buy</Typography>
          <Typography>{data.maxBuy}</Typography>
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          mt={4}
          alignItems={"center"}
        >
          <Typography>Initial LP</Typography>
          <Typography>{data.initialLP}</Typography>
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          mt={4}
          alignItems={"center"}
        >
          <Typography>Owner</Typography>
          <Typography>
            {data.owner ? abbreviateString(data.owner) : ""}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Review;
