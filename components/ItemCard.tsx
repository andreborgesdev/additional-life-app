import React from "react";
import {
  Flex,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Tooltip,
  chakra,
  Icon,
} from "@chakra-ui/react";

import { FiHeart } from "react-icons/fi";
import { Item } from "../pages/index";
import Link from "next/link";

interface ItemCardProps {
  item : Item
}

export default function ItemCard(props: ItemCardProps) {
  function isNew() : boolean {
    const postedOnDate = props.item.postedOn;

    return true;
  }

  return (
    <Flex p={50} w="full" alignItems="center" justifyContent="center">
      <Link href={props.item.url != null ? props.item.url : `/items/${props.item.id}`} passHref={true}>
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          maxW="sm"
          borderWidth="1px"
          rounded="lg"
          shadow="2xl"
          position="relative">
          <Box 
            position="absolute"
            top={2}
            right={2}>
            {isNew && (
              <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                New
              </Badge>
            )}
          </Box>

          <Image
            src={props.item.imageUrl}
            alt={`Picture of ${props.item.name}`}
            roundedTop="lg"
          />

          <Box p="2">
            <Flex mt="1" justifyContent="space-between" alignContent="center">
              <Box
                fontSize="2xl"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated>
                {props.item.name}
              </Box>
              <Tooltip
                label="Add as favorite"
                bg="white"
                placement={'top'}
                color={'gray.800'}
                fontSize={'1.2em'}>
                <chakra.a href={'#'} display={'flex'}>
                  <Icon as={FiHeart} h={7} w={7} alignSelf={'center'} />
                </chakra.a>
              </Tooltip>
            </Flex>

            <Flex justifyContent="space-between" alignContent="center">
              {/* <Rating rating={data.rating} numReviews={data.numReviews} /> */}
              <Box fontSize="12px" color={useColorModeValue('gray.800', 'gray.500')}>
              {props.item.description}
              </Box>
            </Flex>
          </Box>
        </Box>
      </Link>
    </Flex>
  );
}