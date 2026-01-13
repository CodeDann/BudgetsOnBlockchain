import { Button } from '@mantine/core';
import classes from '../scss/AuthButton.module.scss';
import { useState } from 'react';
import { useInterval } from '@mantine/hooks';
import { Progress } from '@mantine/core';

interface AuthButtonProps {
  isConnected?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function AuthButton({ isConnected = false, onClick, children, disabled }: AuthButtonProps) {
  return (
    <Button
      fullWidth
      className={classes.button}
      onClick={onClick}
      radius="md"
      disabled={isConnected || disabled}
      loading={disabled}
    >
      <div className={classes.label}>
        {children || (isConnected ? 'Connected' : 'Authenticate')}
      </div>
    </Button>
  );
}

interface SendButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function SendButton({ onClick, disabled, loading }: SendButtonProps) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const interval = useInterval( 
    () =>
      setProgress((current) => {
        if (current < 100) {
          return current + 1;
        }

        interval.stop();
        setLoaded(true);
        return 0;
      }),
    20
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior if no onClick provided
      if (loaded) {
        setLoaded(false);
      } else if (!interval.active) {
        interval.start();
      }
    }
  };

  return (
    <Button
      fullWidth
      className={classes.buttonSend}
      onClick={handleClick}
      radius="md"
      disabled={disabled || loading}
      loading={loading}
      mt="md"
    >
      <div className={classes.label}>
        {loading ? 'Processing...' : progress !== 0 ? 'Processing...' : loaded ? 'Recorded' : 'Record Transaction'}
      </div>
      {!loading && progress !== 0 && (
        <Progress
          value={progress}
          className={classes.progress}
          radius="sm"
        />
      )}
    </Button>
  );
}