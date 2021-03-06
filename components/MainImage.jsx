import styles from './MainImage.module.css'
import { useState } from 'react';
import PopUpOverlay from './PopUpOverlay';
import { htmlToReact } from '../lib/util';

export default function MainImage(props) {
	let style = {};
	if (props.image !== undefined) {
		style.backgroundImage = 'url(' + props.image + ')';
	}

	if(!props.fullPageImage&&props.image !== undefined){
		style.minHeight='40vh';
		style.backgroundAttachment='scroll';
	}
	else if(!props.fullPageImage){
		style.minHeight='20vh';
		
	}

	return (<div className={styles.mainImage} style={style}>
		{(props.pageMainMessage !== undefined && props.pageMainMessageShow ) &&
			<PageMessage content={props.pageMainMessage} />

		}
		
		{(props.buttons !== undefined && props.buttons.length > 0) &&
			<MainButtonArea buttons={props.buttons} />

		}
	</div>);

}
function PageMessage(props){
return (<div className={styles.pageMessage}>{htmlToReact(props.content)}</div>)
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
	return (<div className={styles.buttonRow} style={{ justifyContent: props.row.alignment }}>{buttons}</div>);
}

function MainButtonLink(props) {
	return (<a href={props.link} className={styles.mainImagebutton} target={props.newTab ? '_blank' : null}>{props.text}</a>);
}
function MainButtonPopup(props) {
	//todo stop using dangerously set inner html
	// {htmlToReact(props.content)} causes inputs to not be editable
	const [popup,setPopUp]=useState(false);

	return (<><button className={styles.mainImagebutton} onClick={()=>{setPopUp(!popup)}}>{props.text}</button>
	 
		
				<PopUpOverlay display={popup} closeFunction={()=>{setPopUp(false)}}><div className={styles.mainImageButtonPopUpContent} dangerouslySetInnerHTML={{__html:props.content}}></div></PopUpOverlay>
		
	
		</>);
}