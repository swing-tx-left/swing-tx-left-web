import styles from './ContentBlock.module.css'
import rehypeReact from 'rehype-react';
import unified from 'unified';
import rehypeParse from 'rehype-parse';


export default function ContentBlocks(props) {
	



	
	return <>{mkBlocks(props.content)}</>;
}

function htmlToReact(html){
	return unified()
	.use(rehypeParse,{fragment:true})
	.use(rehypeReact,{
		createElement:React.createElement,
		fragment:React.Fragment
	})
	.processSync(html)
	.result;

}


function mkBlocks(content){
	let contentBlockArr = [];
	//note keys arnt ideal
	for (let sec of content) {
		if (sec.type === 'normal-section') {
			contentBlockArr.push(
				<div  className={styles.sec} key={JSON.stringify(sec)} id={(sec.id !== undefined && sec.id !== '') ? sec.id : null}>

					<h1>{sec.header}</h1>
					{htmlToReact(sec.content)}
				</div>)
		}
		else if (sec.type === 'sections-with-toc') {
			let toc = sec.sections.map((el) => {
				return <li key={el.id}><a href={'#' + el.id}> {el.header}</a></li>
			});

			contentBlockArr.push(

				<div key={JSON.stringify(sec)} className={styles.sec} >
					<ul>
						{toc}
					</ul>

				</div>);

			contentBlockArr = contentBlockArr.concat(mkBlocks(sec.sections))
		}
	}
	return contentBlockArr;
} 
