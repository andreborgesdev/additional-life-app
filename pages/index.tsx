import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Container
} from "@chakra-ui/react"
import NavBar from "../components/NavBar";
import ItemCard from "../components/ItemCard";
import Footer from "../components/Footer";
import type { NextPage } from 'next'
import axios from "axios";
// import "../css/Home.css";

interface ServerResponse {
  data: Item
}

export interface Item {
  id: number,
  name: string,
  description: string,
  location: string,
  isTaken: boolean,
  postedOn: string,
  imageUrl: string,
  url: string
}

const Home: NextPage = () => {

  const apiUrl = 'http://localhost:8080';
  const [items, setItems] = useState<Item[]>([]);

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
    getItems();
  }, []);

  function getItems() {
    axios.get<Item[]>(`${apiUrl}/api/v1/items`)   
    .then((response) => {
      setItems([...response.data]);
    });
  };

  return (
    <>
      <NavBar />
      <Box>
        <Grid templateColumns="repeat(5, 1fr)">
          { items.map((item, index)=> {
            return (
              <Box w="100%" h="10" > 
                <ItemCard item={item} />
              </Box>
            )})
          }
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default Home;