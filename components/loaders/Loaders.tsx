import {cn} from "@/lib/utils";
import styles from './loaders.module.css'

export function DotLoader({className}: { className?: string }) {
    return (
        <div className={cn(`flex items-center justify-center h-screen`, className)}>
            <div className={styles.container}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
            </div>
        </div>
    );
}
