import { Header } from './Header';
import { InfoGrid } from './Grid';
import styles from '../scss/AboutPage.module.scss';

function AboutPage() {

    return <>
        
        <Header />
        <div className={styles.mainBody}>
            <InfoGrid />
        </div>
    </>

}

export default AboutPage