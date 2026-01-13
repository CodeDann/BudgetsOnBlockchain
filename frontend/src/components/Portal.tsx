import { Header } from './Header';
import styles from '../scss/Portal.module.scss';
import { CardMetaAuth } from './Card';
import { RecordOutgoingCard } from './RecordOutgoingCard';

function Portal() {

    return <>
        
        <Header />
        <div className={styles.mainBody}>
            <CardMetaAuth />
            <RecordOutgoingCard/>
        </div>
    </>

}

export default Portal