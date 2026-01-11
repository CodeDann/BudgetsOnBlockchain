import { Header } from './Header';
import styles from '../scss/ChainExplorer.module.scss';
import { Searchbox } from './Searchbox';
import { NewTransactionsTable } from './NewTransactionsTable';

function ChainExplorer() {

    return <>
        
            <Header />
            <div className={styles.tophalf}>
                <div className={styles.searchBox}>
                    <Searchbox/>
                </div>
            </div>
            <div className={styles.bottomhalf}>
                <div className={styles.newTrxTable}>
                    <h2> Latest Transactions: </h2>
                    <NewTransactionsTable/>
                </div>
            </div>

        </>

}

export default ChainExplorer;