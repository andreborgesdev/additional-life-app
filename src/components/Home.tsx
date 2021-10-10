import React from "react";
import {
  Box,
  Grid,
} from "@chakra-ui/react"
import NavBar from "./NavBar";
import Product from "./Product";
import Footer from "./Footer";
import "../css/Home.css";

function Home() {

  return (
    <>
      <div className="wrapper">
        <NavBar />
        <Box p={4}>
        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          { [...Array(4)].map((e, i) => 
                  <Box w="100%" h="10" > 
                  <Product />
                </Box>
          )}
        </Grid>
        </Box>
        {/* <div className="footer"> */}
          <Footer />
        {/* </div> */}
      </div>
    </>
  );
}
export default Home;
