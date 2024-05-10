import { Grid, Typography } from "@mui/material";
import TokenInfoContent from "./token-info-content/TokenInfoContent";
import { useEffect, useState } from "react";
import { getCounts } from "../../services/api";

const TokenPage = () => {
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await getCounts();
        console.log("resu==", result.data);
        setTotal(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Grid container justifyContent={"center"}>
        <Typography variant="h5" mt={8} textAlign={"center"}>
          Create your own tokens with one click!
        </Typography>
      </Grid>
      <Grid container justifyContent={"center"}>
        <Typography variant="h5" mt={1} textAlign={"center"}>
          {total} Tokens Created
        </Typography>
      </Grid>

      <TokenInfoContent />
    </>
  );
};

export default TokenPage;
