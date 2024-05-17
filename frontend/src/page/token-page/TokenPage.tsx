import { Box, Grid, Typography } from "@mui/material";
import TokenInfoContent from "./token-info-content/TokenInfoContent";

const TokenPage = () => {
  // const [total, setTotal] = useState<number>(0);
  // const [loading, setLoading] = useState<boolean>(false);
  // // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       let result = await getCounts();
  //       console.log("resu==", result.data);
  //       setTotal(result.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error(error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);
  return (
    <>
      <Box position={"relative"}>
        <Grid container justifyContent={"center"}>
          <Typography variant="h5" mt={8} textAlign={"center"}>
            Create your own tokens with ease!
          </Typography>
        </Grid>
        {/* <Grid container justifyContent={"center"} sx={{ position: "relative" }}>
          <Typography variant="h5" mt={1} textAlign={"center"}>
            {loading ? (
              <Skeleton sx={{ display: "inline-block" }} width={40} />
            ) : (
              total
            )}{" "}
            Tokens Created
          </Typography>
          <img
            src={logo}
            style={{
              top: 0,
              // backgroundImage: `url(${logo})`,
              // height: 40,
              width: 140,

              right: 0,
              position: "absolute",
            }}
          /> */}
        {/* <img
            src={coin}
            style={{
              top: 0,
              // backgroundImage: `url(${logo})`,
              // height: 40,
              width: 140,

              left: 0,
              position: "absolute",
            }}
          /> */}
        {/* </Grid> */}
        <TokenInfoContent />
      </Box>
    </>
  );
};

export default TokenPage;
