import styles from './PopUpOverlay.module.css'
import { htmlToReact } from '../lib/util'
import { useState } from 'react';

export default function PopUpOverlay(props) {
	const [maximize,setMaximize]=useState(false);

	let classes=styles.popup;
	if(maximize){
		classes +=' '+styles.popupMax;
	}
	return (<>
		<div className={styles.popupBackDrop}  onClick={props.closeFunction}></div>
		<div className={classes}>
			<div className={styles.titleBar}>
				<button onClick={props.closeFunction} className={styles.close}>X</button>
				<button onClick={()=>{setMaximize(!maximize)}} className={styles.max}>{maximize?'>-<':'<->'}</button>
			</div>
			<div>{htmlToReact(props.message)}</div>
		</div>
	</>);

}