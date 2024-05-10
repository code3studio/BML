import { Grid, Skeleton, Typography } from "@mui/material";
import TokenInfoContent from "./token-info-content/TokenInfoContent";
import { useEffect, useState } from "react";
import { getCounts } from "../../services/api";

const TokenPage = () => {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let result = await getCounts();
        console.log("resu==", result.data);
        setTotal(result.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
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
          {loading ? (
            <Skeleton sx={{ display: "inline-block" }} width={40} />
          ) : (
            total
          )}{" "}
          Tokens Created
        </Typography>
      </Grid>

      <TokenInfoContent />
    </>
  );
};

export default TokenPage;
