import rehypeReact from 'rehype-react';
import unified from 'unified';
import rehypeParse from 'rehype-parse';
import React from 'react';


export function htmlToReact(html){
	return unified()
	.use(rehypeParse,{fragment:true})
	.use(rehypeReact,{
		createElement:React.createElement,
		fragment:React.Fragment
	})
	.processSync(html)
	.result;

}