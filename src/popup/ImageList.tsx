import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import repo, { DbImage } from "../repo/image";
import getHostInfo from "../getHostInfo";

const ImageList: React.FC = () => {
  const [filter, setFilter] = useState<string>("ALL");
  const [searchText, setSearchText] = useState<string>("");
  const [imageList, setImageList] = useState<DbImage[]>([]);
  const [pageId, setPageId] = useState<string>("");

  async function loadImages(pageId: string | null = null) {
    const images = await repo.fetchImages(pageId);
    setImageList(images);
  }

  async function getHostInformations() {
    const hostInfo = await getHostInfo();
    const pageId = hostInfo.location
      .split("/")
      .slice(-1)[0]
      .split("-")
      .slice(-1)[0];
    setPageId(pageId);
    loadImages(pageId);
  }

  useEffect(() => {
    getHostInformations();
  }, []);

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Image List
      </Heading>
      <VStack spacing={4} align="start">
        <Box>
          <Select
            width="200px"
            value={filter}
            onChange={(e) => {
              if (e.target.value === "ALL") {
                loadImages();
              } else {
                loadImages(pageId);
              }
              setFilter(e.target.value);
            }}
          >
            <option value="ALL">All</option>
            {/* Replace with your actual page IDs */}
            <option value="1">Current Page</option>
            {/* Add more options if needed */}
          </Select>
        </Box>
        {filter !== "ALL" && <div> Page ID: {pageId}</div>}
        <Input
          type="text"
          placeholder="Search Images"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </VStack>
      <SimpleGrid columns={3} spacing={4} mt={4}>
        {imageList.map((image) => (
          <Box key={image.id} borderWidth="1px" borderRadius="lg" p={4}>
            {/* Display image card content here */}
            <Text>{image.name}</Text>
            <Text>Size: {image.size} KB</Text>
            {/* Add image display here */}
            <img src={image.imageUrl} alt={image.name} width="100%" />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ImageList;
