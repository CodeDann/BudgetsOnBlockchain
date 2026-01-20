import { IconWallet } from '@tabler/icons-react';
import { Group, Text, Paper } from '@mantine/core';
import { useMetaMask } from '../hooks/useMetaMask';
import classes from '../scss/UserIcon.module.scss';
import logo from '../assets/metamask-logo.svg';

interface UserIconProps {
  metaMaskState: ReturnType<typeof useMetaMask>;
}

export function UserIcon({ metaMaskState }: UserIconProps) {
  const { account } = metaMaskState;

  if (!account) {
    return null;
  }

  // Generate a simple avatar color based on wallet address
  // const getAvatarColor = (address: string) => {
  //   const colors = ['#FF5C16', '#3167a0', '#16a01f', '#e34df7', '#3867ea'];
  //   const index = parseInt(address.slice(2, 3), 16) % colors.length;
  //   return colors[index];
  // };

  // const avatarInitials = account.slice(2, 4).toUpperCase();

  return (
    <Paper withBorder radius="md" p="md" shadow="sm" className={classes.userIcon}>
      <Group wrap="nowrap" gap="md">
        <img src={logo} alt="MetaMask" style={{ width: 60, height: 60 }} />
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            Connected Wallet
          </Text>
          <Group wrap="nowrap" gap={8} mt={4}>
            <IconWallet stroke={1.5} size={16} className={classes.icon} />
            <Text fz="sm" fw={500} className={classes.address}>
              {account.slice(0, 6)}…{account.slice(-4)}
            </Text>
          </Group>
          <Text fz="xs" c="dimmed" mt={2} style={{ fontFamily: 'monospace' }}>
            {account}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}