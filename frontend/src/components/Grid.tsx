import { Container, SimpleGrid } from '@mantine/core';
import { CardWhat, CardWho, CardWhy } from './Card';

// const getChild = (height: number) => <Skeleton height={height} radius="md" animate={false} />;
// const BASE_HEIGHT = 360;
// const getSubHeight = (children: number, spacing: number) =>
  // BASE_HEIGHT / children - spacing * ((children - 1) / children);

export function InfoGrid() {
  // const theme = useMantineTheme();
  return (
    <Container my="md" size="100%" px={100}>
      <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="md">
        <CardWhat />
        <CardWho />
        <CardWhy />
      </SimpleGrid>
    </Container>
  );
}