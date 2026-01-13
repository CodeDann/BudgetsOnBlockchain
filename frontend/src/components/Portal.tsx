import { Header } from './Header';
import styles from '../scss/Portal.module.scss';
import { CardMetaAuth } from './Card';
import { RecordOutgoingCard } from './RecordOutgoingCard';
import { UserIcon } from './UserIcon';
import { useMetaMask } from '../hooks/useMetaMask';
import { Stack } from '@mantine/core';

function Portal() {
    const metaMaskState = useMetaMask();
    const { isAuthenticated } = metaMaskState;

    return <>
        <Header />
        <div className={styles.mainBody}>
            <Stack gap="xl" style={{ maxWidth: '600px', width: '100%', padding: '2rem' }}>
                {!isAuthenticated ? (
                    <CardMetaAuth metaMaskState={metaMaskState} />
                ) : (
                    <>
                        <UserIcon metaMaskState={metaMaskState} />
                        <RecordOutgoingCard />
                    </>
                )}
            </Stack>
        </div>
    </>

}

export default Portal