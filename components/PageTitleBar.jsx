import styles from './PageTitleBar.module.css'


export default function PageTitleBar(props){
return <h1 className={styles.pageTitleBar}> {props.title}</h1>
}