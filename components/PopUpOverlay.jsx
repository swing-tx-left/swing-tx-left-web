import styles from './PopUpOverlay.module.css'

import { useState, useEffect } from 'react';
import {CSSTransition} from 'react-transition-group';

export default function PopUpOverlay(props) {
	const [maximize,setMaximize]=useState(false);

	let classes=styles.popup;
	if(maximize){
		classes +=' '+styles.popupMax;
	}


	// const [innerHeight,setInnerHeight]=useState(0)
	// let setPopUpSize=()=>{
	// 	setInnerHeight(window.innerHeight);
	// }
	
	// useEffect(()=>{
	// 	setPopUpSize();
	// 	window.addEventListener('resize',setPopUpSize)
	// });
	useEffect(()=>{
		if(props.display){
			document.getElementsByTagName('body')[0].style.overflow='hidden';

			return ()=>{
				document.getElementsByTagName('body')[0].style.overflow=null;
			}
		}
		
	})
	
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
			<div className={classes} >
			<div className={styles.titleBar}>
					<button onClick={props.closeFunction} className={styles.close}>Close</button>
					{/* <button onClick={()=>{setMaximize(!maximize)}} className={styles.max}>{maximize?'>-<':'<->'}</button> */}
				</div>
				<div className={styles.popupContent}>{props.children}</div>	
			</div>
		</CSSTransition>


	</>);

}