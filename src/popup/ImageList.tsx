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

const ImageList: React.FC = () => {
  const [filter, setFilter] = useState<string>("ALL");
  const [searchText, setSearchText] = useState<string>("");
  const [imageList, setImageList] = useState<DbImage[]>([]);

  async function loadImages() {
    const images = await repo.fetchImages();
    setImageList(images);
  }

  useEffect(() => {
    loadImages();
  }, []);

  // Filter images based on selected filter and search text
  const filteredImages = imageList.filter((image) => {
    if (filter === "ALL") {
      return image.name.toLowerCase().includes(searchText.toLowerCase());
    }
    return (
      image.pageId.toString() === filter &&
      image.name.toLowerCase().includes(searchText.toLowerCase())
    );
  });
  
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
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            {/* Replace with your actual page IDs */}
            <option value="1">Current Page</option>
            {/* Add more options if needed */}
          </Select>
        </Box>
        <Input
          type="text"
          placeholder="Search Images"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </VStack>
      <SimpleGrid columns={3} spacing={4} mt={4}>
        {filteredImages.map((image) => (
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
