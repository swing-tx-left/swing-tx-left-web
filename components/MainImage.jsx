import styles from './MainImage.module.css'
import { useState } from 'react';
import PopUpOverlay from './PopUpOverlay';
import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';


export default function MainImage(props) {
	let style = {};
	if (props.image !== undefined) {
		style.backgroundImage = 'url(' + props.image + ')';
	}

	return (<div className={styles.mainImage} style={style}>
		{(props.buttons !== undefined && props.buttons.length > 0) &&
			<MainButtonArea buttons={props.buttons} />

		}
	</div>);

}

function MainButtonArea(props) {

	let rows = props.buttons.map((el, index) => {

		return (<MainButtonRow key={index} row={el} />);

	})

	return (<>{rows}</>);
}

function MainButtonRow(props) {
	let buttons = props.row.buttons.map((el, index) => {
		if (el.type === 'popup') {
			return <MainButtonPopup key={index} {...el} />
		}
		else if (el.type == 'link') {
			return <MainButtonLink key={index} {...el} />
		}
	});

	return (<div style={{ textAlign: props.row.alignment }}>{buttons}</div>);
}

function MainButtonLink(props) {
	return (<a href={props.link} target={props.newTab ? '_blank' : null}>{props.text}</a>);
}
function MainButtonPopup(props) {
	
	const [popup,setPopUp]=useState(false);

	return (<><button onClick={()=>{setPopUp(!popup)}}>{props.text}</button>
	{popup &&
		<PopUpOverlay closeFunction={()=>{setPopUp(false)}} message={props.content}/>}
		</>);
}