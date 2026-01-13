import logo from '../assets/tt-icon3.png'
import { Burger, Center, Container, Group, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import classes from '../scss/Header.module.scss';
import { useMantineTheme } from '@mantine/core';


const links = [
  { link: '/', label: 'About' },
  { link: '/explorer', label: 'Transaction Explorer' },
  { link: '/portal', label: 'Portal' }
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const theme = useMantineTheme(); // access theme

  // Find the label for the current path
  const currentPage = links.find((l) => l.link === location.pathname)?.label || 'Page';

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>
        <Link to={item.link} className={classes.link}>
          {item.label}
        </Link>
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <Link to={link.link} className={classes.link}>
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
              </Center>
            </Link>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link key={link.label} to={link.link} className={classes.link}>
        {link.label}
      </Link>
    );
  });

  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <img 
            src={logo} 
            alt="Transparent Transactions" 
            className={classes.logo} 
          />          
<span
              className={classes.pageTitle}
              style={{
                fontFamily: theme.fontFamily,
                fontWeight: 700, // bold
                fontSize: theme.fontSizes.md,
                lineHeight: "1.5",
              }}
            >
              {currentPage}
            </span>          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}
