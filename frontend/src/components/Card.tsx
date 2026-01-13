import { IconColorSwatch } from '@tabler/icons-react';
import { Paper, Text, ThemeIcon } from '@mantine/core';
import classes from '../scss/CardGradient.module.scss';
import { AuthButton } from './AuthButton';
import logo from '../assets/metamast-logo.svg'; // import your logo

export function CardWhy() {
  return (
    <Paper withBorder radius="md" shadow="xl" className={classes.card} style={{
            '--card-gradient-start': '#ea3838ff',
            '--card-gradient-end': '#e34df7ff',
        }}>
      <ThemeIcon
        size="xl"
        radius="md"
        variant="gradient"
        gradient={{ deg: 45, from: 'red', to: 'pink' }}

      >
        <IconColorSwatch size={28} stroke={1.5} />
      </ThemeIcon>
      <Text size="xl" fw={500} mt="md">
        Why?
      </Text>
      <Text size="sm" mt="sm" c="dimmed">
         Explaination of why transparent transactions matters for charities. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
      </Text>
    </Paper>
  );
}


export function CardWhat() {
  return (
    <Paper withBorder radius="md" shadow="xl" className={classes.card} style={{
            '--card-gradient-start': '#3867eaff',
            '--card-gradient-end': '#701db9ff',
        }}>
    <ThemeIcon
        size="xl"
        radius="md"
        variant="gradient"
        gradient={{ deg: 45, from: 'blue', to: 'purple' }}
      >
        <IconColorSwatch size={28} stroke={1.5} />
      </ThemeIcon>
      <Text size="xl" fw={500} mt="md">
        What?
      </Text>
      <Text size="sm" mt="sm" c="dimmed">
        Explaination of What transparent transactions are. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
      </Text>
    </Paper>
  );
}


export function CardWho() {
  return (
    <Paper withBorder radius="md" shadow="xl" className={classes.card} style={{
            '--card-gradient-start': '#16a01fff',
            '--card-gradient-end': '#f3f046ff',
        }}>
    <ThemeIcon
        size="xl"
        radius="md"
        variant="gradient"
        gradient={{ deg: 45, from: 'green', to: 'yellow' }}
      >
        <IconColorSwatch size={28} stroke={1.5} />
      </ThemeIcon>
      <Text size="xl" fw={500} mt="md">
        Who?
      </Text>
      <Text size="sm" mt="sm" c="dimmed">
        Explaination of which charities are using Transparent Transactions. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
      </Text>
    </Paper>
  );
}

export function CardMetaAuth() {
  return (
    <Paper withBorder radius="md" shadow="xl" className={classes.card} style={{
            '--card-gradient-start': '#5a4710ff',
            '--card-gradient-end': '#df8231ff',
        }}>
    <ThemeIcon
        size="xl"
        radius="md"
        variant="gradient"
        gradient={{ deg: 45, from: 'orange', to: 'brown' }}
      >
        <img src={logo} alt="Transparent Transactions" style={{ width: 28, height: 28 }} />
      </ThemeIcon>
      <Text size="xl" fw={500} mt="md">
        Authenticate with MetaMask
      </Text>
      <AuthButton/>
    </Paper>
  );
}