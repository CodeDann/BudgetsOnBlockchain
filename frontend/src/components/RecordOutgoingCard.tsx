import { Card, Group, Switch, Text } from '@mantine/core';
import classes from '../scss/RecordOutgoingCard.module.scss';
import { InputBoxAmount, InputBoxDescription, InputBoxRecipient } from './InputBox';
import { SendButton } from './AuthButton';

const data = [
  { title: 'Messages', description: 'Direct messages you have received from other users' },
  { title: 'Review requests', description: 'Code review requests from your team members' },
  { title: 'Comments', description: 'Daily digest with comments on your posts' },
  {
    title: 'Recommendations',
    description: 'Digest with best community posts from previous week',
  },
];

export function RecordOutgoingCard() {

  return (
    <Card withBorder radius="md" p="xl" shadow="xl" className={classes.card}>
      <Text fz="lg" className={classes.title} fw={500}>
        Record outgoing transaction
      </Text>
      <Text fz="xs" c="dimmed" mt={3} mb="xl">
        This will be automatically stored on-chain
      </Text>

      <InputBoxAmount/>
      <InputBoxDescription/>
      <InputBoxRecipient/>
      <SendButton/>
    </Card>
  );
}