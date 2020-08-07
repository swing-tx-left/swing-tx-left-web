import styles from './PopUpOverlay.module.css'

import { useState } from 'react';
import {CSSTransition} from 'react-transition-group';

export default function PopUpOverlay(props) {
	const [maximize,setMaximize]=useState(false);

	let classes=styles.popup;
	if(maximize){
		classes +=' '+styles.popupMax;
	}
	return (<>
		<CSSTransition in={props.display}  unmountOnExit={true}  timeout={500} classNames={{
				enter:styles.popupBackDropEnter,
				enterActive:styles.popupBackDropEnterActive,
				exit:styles.popupBackDropExit,
				exitActive:styles.popupBackDropExitActive
		}}><div className={styles.popupBackDrop}  onClick={props.closeFunction}></div></CSSTransition> 
		
		<CSSTransition in={props.display} unmountOnExit={true}  timeout={500}  classNames={{
			enter:styles.popupEnter,
			enterActive:styles.popupEnterActive,
			exit:styles.popupExit,
			exitActive:styles.popupExitActive
		}}>
			<div className={classes}>
				<div className={styles.titleBar}>
					<button onClick={props.closeFunction} className={styles.close}>X</button>
					<button onClick={()=>{setMaximize(!maximize)}} className={styles.max}>{maximize?'>-<':'<->'}</button>
				</div>
				<div className={styles.popupContent}>{props.children}</div>
			</div>
		</CSSTransition>


	</>);

}