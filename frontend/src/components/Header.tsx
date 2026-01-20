import logo from '../assets/tt-icon3.png';
import { Burger, Center, Container, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import { useMantineTheme } from '@mantine/core';
import classes from '../scss/Header.module.scss';

const links = [
  { link: '/', label: 'About' },
  { link: '/explorer', label: 'Transaction Explorer' },
  { link: '/portal', label: 'Portal' },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const theme = useMantineTheme();

  const currentPage =
    links.find((l) => l.link === location.pathname)?.label ?? 'Page';

  const items = links.map((link) => (
    <Link key={link.label} to={link.link} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <Center>
            <img
              src={logo}
              alt="Transparent Transactions"
              className={classes.logo}
            />
            <span
              className={classes.pageTitle}
              style={{
                fontFamily: theme.fontFamily,
                fontWeight: 700,
                fontSize: theme.fontSizes.md,
                lineHeight: '1.5',
                marginLeft: '0.75rem',
              }}
            >
              {currentPage}
            </span>
          </Center>

          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>

          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            hiddenFrom="sm"
          />
        </div>
      </Container>
    </header>
  );
}
