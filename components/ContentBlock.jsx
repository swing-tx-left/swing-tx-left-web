import styles from './ContentBlock.module.css'
import rehypeReact from 'rehype-react';
import unified from 'unified';
import rehypeParse from 'rehype-parse';
import {htmlToReact} from '../lib/util'
import {Events} from './events/Events';


export function ContentBlocks(props) {
	



	
	return <MkBlocks content={props.content} eventData={props.eventData}/>;
}

// function htmlToReact(html){
// 	return unified()
// 	.use(rehypeParse,{fragment:true})
// 	.use(rehypeReact,{
// 		createElement:React.createElement,
// 		fragment:React.Fragment
// 	})
// 	.processSync(html)
// 	.result;

// }

export function ContentBlock(props){
	return (<div className={styles.sec} id={props.blockid}>
		{props.children}

	</div>)
}

function MkBlocks({content,eventData}){
	let contentBlockArr = [];
	//note keys arnt ideal
	for (let sec of content) {
		if (sec.type === 'normal-section') {
			contentBlockArr.push(
				<ContentBlock  key={JSON.stringify(sec)} blockid={(sec.id !== undefined && sec.id !== '') ? sec.id : null}>
					<h1>{sec.header}</h1>
					{htmlToReact(sec.content)}
				</ContentBlock>)
		}
		else if (sec.type === 'events') {
			contentBlockArr.push(
			
					//fixthis
					<Events key={JSON.stringify(sec)} secid={(sec.id !== undefined && sec.id !== '') ? sec.id : null} eventData={eventData}/>
				)
		}
		else if (sec.type === 'sections-with-toc') {
			let toc = sec.sections.map((el) => {
				return <li key={el.id}><a href={'#' + el.id}> {el.header}</a></li>
			});

			contentBlockArr.push(

				<ContentBlock key={JSON.stringify(sec)}>
					<ul>
						{toc}
					</ul>

				</ContentBlock>);

			contentBlockArr.push(<MkBlocks key={JSON.stringify(sec.sections)} content={sec.sections} eventData={eventData}/>)
		}
	}
	return contentBlockArr;
} 
