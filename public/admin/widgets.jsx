import React from 'react'

import {Editor} from '@tinymce/tinymce-react';

export class SlugUnique extends React.Component {
	constructor(props) {
		super(props);
		this.updateVal = this.updateVal.bind(this);
		this.fillBasedOnTitle = this.fillBasedOnTitle.bind(this);
		this.getNoOtherSlugs();
		this.state = {
			fillWithTitle: false
		}

	}

	async getNoOtherSlugs() {
		let useful = JSON.parse(JSON.stringify(this.props))
		let q = await this.props.query('slugsSearch', useful.entry.collection, ['slug'], '')
		console.log('search');
		console.log(this.props);
		console.log(q.payload);
		//console.log(q.payload?.response);


	}

	updateVal(event) {
		this.props.onChange(event.target.value);
		this.getNoOtherSlugs();


	}
	async fillBasedOnTitle() {
		if (!this.state.fillWithTitle) {
			this.setState({ fillWithTitle: true });
			//force redraw of event to get new props
			this.props.onChange('');
		}
		else {
			this.setState({ fillWithTitle: false });
			let useful = JSON.parse(JSON.stringify(this.props))
			console.log(useful.entry.data.title)
			this.props.onChange(useful.entry.data.title.toLowerCase().replace(/[^\w]/g, '-'));
			this.getNoOtherSlugs();
		}

	}
	componentDidUpdate(prevProps,prevState) {
		//console.log('compup')
	//	console.log(this)
		if(this.state.fillWithTitle){
			this.fillBasedOnTitle();
		}
	}
	isValid() {
		let useful = JSON.parse(JSON.stringify(this.props));
		console.log(useful)

		console.log(useful.queryHits.slugsSearch)
		if (useful.queryHits.slugsSearch.some((el) => {
			console.log(this.props.entry.path)

			return el.data.slug === this.props.value && useful.entry.path !== el.path;
		})) {
			return { error: { message: 'Chose a unique slug! This one already exists' } };
		}
		else {
			return true;
		}


		return false;

	}
	// console.log(props)
	// return ( <pre>
	// 	{}
	// 	{

	// 	}
	// 	{JSON.stringify(props,null,'\t')}
	// 	</pre>);
	render() {
		//

		console.log(this.props);
		return (
			<>

				<input className={this.props.classNameWrapper} type="text" value={this.props.value} onChange={(e) => { this.updateVal(e) }} id={this.props.forID} />
				{(this.props.value === '' || this.props.value === undefined) &&
					<button onClick={(e)=>{
						console.log('out')
						console.log(this);
						this.fillBasedOnTitle()}}>Fill BasedOn title</button>
				}
			</>
		);
	}

}
export function SlugUniquePrev(props) {
	return <span>Url/ {props.value}</span>
}




export class HTMLEditor extends React.Component{

	constructor(props){
		super(props)
		//this.state={content:this.props.value};
		this.blah=this.blah.bind(this);

	}
	blah(content,editor){
		console.log(content);
		console.log(this.props);
	
		this.props.onChange(content);
	}

	render(){
		return (
			
				<Editor value={this.props.value} init={{
					height:600,
					convert_urls:false,
					plugins:'image anchor table link lists advlists charmap emoticons wordcount fullscreen code' ,
					toolbar:['undo redo | aligncenter alignjustify alignleft alignnone alignright | bold italic | numlist bullist | indent outdent | removeformat formatselect']
				}}  outputFormat='html' onEditorChange={this.blah}/>

			
		);
	}

}

export function HTMLPreview(props){
	return <div>TODO HTML PREVIEW</div>
}