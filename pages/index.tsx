import React from "react";
import {
  Box,
  Grid,
  Container
} from "@chakra-ui/react"
import NavBar from "./NavBar";
import Product from "./Product";
import Footer from "./Footer";
import type { NextPage } from 'next'
// import "../css/Home.css";

const Home: NextPage = () => {

  return (
    <>
      <NavBar />
      {/* <Container maxWidth="container.xl" p={5}> */}

        <Box p={4}>
          <Grid templateColumns="repeat(4, 1fr)" gap={6}>
            { [...Array(4)].map((e, i) => 
                    <Box w="100%" h="10" > 
                    <Product />
                  </Box>
            )}
          </Grid>
        </Box>
      {/* </Container> */}

      {/* <Footer /> */}
    </>
  );
}

export default Home;