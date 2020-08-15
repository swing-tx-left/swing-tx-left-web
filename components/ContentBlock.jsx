import styles from './ContentBlock.module.css'
import {htmlToReact} from '../lib/util'
 import {Events} from './events/Events';
import dynamic from 'next/dynamic';


const DynamicEvents=dynamic(()=>{
	return import('./events/Events').then((obj)=>{ return obj.Events})
},{ssr:false});


export function ContentBlocks(props) {
	



	
	return <MkBlocks content={props.content} />;
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

function MkBlocks({content}){
	let contentBlockArr = [];
	//note keys arnt ideal
	//let index=0;
	for (let sec of content) {
		if (sec.type === 'normal-section') {
			contentBlockArr.push(
				<ContentBlock  key={sec.uuid} blockid={(sec.id !== undefined && sec.id !== '') ? sec.id : null}>
					<h1>{sec.header}</h1>
					{htmlToReact(sec.content)}
				</ContentBlock>)
		}
		else if (sec.type === 'events') {
			contentBlockArr.push(
			
					
					<Events key={sec.uuid} secid={(sec.id !== undefined && sec.id !== '') ? sec.id : null} eventData={sec.eventData} eventDataByDay={sec.eventDataByDay}/>
				)
		}
		else if (sec.type === 'sections-with-toc') {
			let toc = sec.sections.map((el) => {
				return <li key={'toc-list-item-'+el.uuid}><a href={'#' + el.id}> {el.header}</a></li>
			});

			contentBlockArr.push(

				<ContentBlock key={'table-of-contents-'+sec.uuid}>
					<ul>
						{toc}
					</ul>

				</ContentBlock>);

			contentBlockArr.push(<MkBlocks key={sec.uuid} content={sec.sections} />)
		}
		
	}
	return contentBlockArr;
} 
