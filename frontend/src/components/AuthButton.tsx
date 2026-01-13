import { useState } from 'react';
import { Button, Progress, rgba, useMantineTheme } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import classes from '../scss/AuthButton.module.scss';

export function AuthButton() {
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

  return (
    <Button
      fullWidth
      className={classes.button}
      onClick={() => (loaded ? setLoaded(false) : !interval.active && interval.start())}
      radius="md"
    >
      <div className={classes.label}>
        {progress !== 0 ? 'Processing...' : loaded ? 'Authenticated' : 'Authenticate'}
      </div>
      {progress !== 0 && (
        <Progress
          value={progress}
          className={classes.progress}
          radius="sm"
        />
      )}
    </Button>
  );
}

export function SendButton() {
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

  return (
    <Button
      fullWidth
      className={classes.buttonSend}
      onClick={() => (loaded ? setLoaded(false) : !interval.active && interval.start())}
      radius="md"
    >
      <div className={classes.label}>
        {progress !== 0 ? 'Processing...' : loaded ? 'Recorded' : 'Record Transaction'}
      </div>
      {progress !== 0 && (
        <Progress
          value={progress}
          className={classes.progress}
          radius="sm"
        />
      )}
    </Button>
  );
}