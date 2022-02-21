import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Container
} from "@chakra-ui/react"
import NavBar from "../components/NavBar";
import Product from "../components/Product";
import Footer from "../components/Footer";
import type { NextPage } from 'next'
import axios from "axios";
// import "../css/Home.css";

interface ServerResponse {
  data: Item
}

export interface Item {
  name: string,
  description: string,
  location: string,
  isTaken: boolean,
  postedOn: Date
}

const Home: NextPage = () => {

  const apiUrl = 'http://localhost:8080';
  const [items, setItems] = useState<Item[]>();

  // axios.interceptors.request.use(
  //   config => {
  //     const { origin } = new URL(config.url);
  //     const allowedOrigins = [apiUrl];
  //     const token = localStorage.getItem('token');
  //     if (allowedOrigins.includes(origin)) {
  //       config.headers.authorization = `Bearer ${token}`;
  //     }
      
  //     return config;
  //   },
  //   error => {
  //     return Promise.reject(error);
  //   }
  // );

  useEffect(() => {
    axios.get<Item[]>(`${apiUrl}/api/v1/items`).then((response) => {
      setItems(response.data);
    });
  }, []);

  return (
    <>
      <NavBar />
      {/* <Container maxWidth="container.xl" p={5}> */}

        <Box p={4}>
          <Grid templateColumns="repeat(4, 1fr)" gap={6}>
            { items?.map((item,index)=>{
                <Box w="100%" h="10" > 
                  <Product item={item} />
                </Box>
              })
            }
          </Grid>
        </Box>
      {/* </Container> */}

      {/* <Footer /> */}
    </>
  );
}

export default Home;