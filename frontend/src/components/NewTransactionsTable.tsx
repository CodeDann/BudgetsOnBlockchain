import { useEffect, useState } from 'react';
import { Table, ScrollArea, Text, Badge, Loader, Center, Group, Paper } from '@mantine/core';
import axios from 'axios';

export function NewTransactionsTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8060/fetch_transactions');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Center p="xl"><Loader color="blue" /></Center>;

  const rows = data.map((item: any) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text size="sm" fw={700} variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
          #{item.contract_tx_id}
        </Text>
      </Table.Td>
      
      <Table.Td>
        <Group gap="xs">
          <Text fw={700} size="sm" c="teal.8">
            {item.amount}
          </Text>
          <Text size="xs" c="dimmed" fw={500}>ETH</Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={500}>{item.recipient_name}</Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm" c="dimmed" lineClamp={1}>
          {item.description}
        </Text>
      </Table.Td>

      <Table.Td>
        <Badge 
          variant="filled" 
          color="gray" 
          radius="xs" 
          styles={{ label: { textTransform: 'none', fontFamily: 'monospace' } }}
        >
          {item.trx_hash.slice(0, 6)}...{item.trx_hash.slice(-4)}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Text size="xs" c="dimmed">
          {new Date(item.block_created_time).toLocaleDateString()}
        </Text>
        <Text size="xs" c="dimmed">
          {new Date(item.block_created_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper withBorder shadow="md" radius="md" p="md" mt="xl">
      <ScrollArea h={500}>
        <Table verticalSpacing="md" horizontalSpacing="lg" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th><Text size="xs" c="dimmed" fw={700}>ID</Text></Table.Th>
              <Table.Th><Text size="xs" c="dimmed" fw={700}>AMOUNT</Text></Table.Th>
              <Table.Th><Text size="xs" c="dimmed" fw={700}>RECIPIENT</Text></Table.Th>
              <Table.Th><Text size="xs" c="dimmed" fw={700}>DESCRIPTION</Text></Table.Th>
              <Table.Th><Text size="xs" c="dimmed" fw={700}>TX HASH</Text></Table.Th>
              <Table.Th><Text size="xs" c="dimmed" fw={700}>TIMESTAMP</Text></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? rows : (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text py="xl" c="dimmed">No transactions found.</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}