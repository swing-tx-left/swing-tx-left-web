import React from 'react'

import { Editor } from '@tinymce/tinymce-react';


//cleanup
export class SlugUnique extends React.Component {
	constructor(props) {
		super(props);
		this.updateVal = this.updateVal.bind(this);
		this.fillBasedOnTitle = this.fillBasedOnTitle.bind(this);
		this.isValid=this.isValid.bind(this);
		this.state = {
			fillWithTitle: false,
			slugs: []
		}
		this.getNoOtherSlugs();
	}

	async getNoOtherSlugs() {
		
		let q = await this.props.query('slugsSearch', 'pages', ['slug'], '')
		// 	console.log('search');
		// console.log(this.props);
		console.log(q.payload);
		// 	//console.log(q.payload?.response);
		this.setState({ slugs: q.payload.hits });

		return q;

	}

	updateVal(event) {
		this.props.onChange(event.target.value);
		this.getNoOtherSlugs();
		//console.log(this.state);

	}
	fillBasedOnTitle() {
		console.log(this.props);
		if (!this.state.fillWithTitle) {
			this.setState({ fillWithTitle: true });
			//force redraw of event to get new props
			this.props.onChange('');
		}
		else {
			this.setState({ fillWithTitle: false });
			try {
				this.props.onChange(this.props.entry.toJSON().data.title.toLowerCase().replace(/[^\w]/g, '-'));
			}
			catch (e) {
				alert(e)
			}
			this.getNoOtherSlugs();
		}

	}
	componentDidUpdate(prevProps, prevState) {
		
		if (this.state.fillWithTitle) {
			this.fillBasedOnTitle();
		}
	}
	isValid () {
		
		

		
		if (this.state.slugs.some((el) => {
			console.log(this.props.entry.path)

			return el.data.slug === this.props.value && this.props.entry.toJSON().path !== el.path;
		})) {
			return { error: { message: 'Chose a unique slug! This one already exists' } };
		}
		else {
			return true;
		}


		return false;

	}

	render() {
		//

		console.log(this.props);
		return (
			<>

				<input className={this.props.classNameWrapper} type="text" value={this.props.value} onChange={(e) => { this.updateVal(e) }} id={this.props.forID} />
				{(this.props.value === '' || this.props.value === undefined) &&
					<button onClick={(e) => {
						console.log('out')
						console.log(this);
						this.fillBasedOnTitle()
					}}>Fill BasedOn title</button>
				}
			</>
		);
	}

}
export function SlugUniquePrev(props) {
	return <span>Url/ {props.value}</span>
}




export class HTMLEditor extends React.Component {

	constructor(props) {
		super(props)
		//this.state={content:this.props.value};
		this.blah = this.blah.bind(this);

	}
	blah(content, editor) {
		console.log(content);
		console.log(this.props);

		this.props.onChange(content);
	}

	async getLinks() {
		let q = await this.props.query('', 'pages', ['slug'], '');
		console.log('searchlinks');
		console.log(this.props);
		console.log(q.payload);
		;
		return [
			...q.payload.hits.map((el) => {
				return { title: el.data.title, value: '/' + el.data.slug }
			}),
			{
				title: 'Files', menu: [
					...this.getFiles()
				]
			},

		]
	}
	getFiles() {


		// console.log(await this.props.mediaPaths.get(this.props.config.media_folder));
		//console.log(this.props.onOpenMediaLibrary());
		// console.log(this.props.getAsset({path:'/'}));
		console.log('files');
		console.log(this.props.entry.get('mediaFiles').toJSON());
		return this.props.entry.get('mediaFiles').toJSON().map((el) => {
			return { title: el.name, value: '/files/' + el.name }
		});

	}

	render() {
		return (
			<div>
				<button onClick={() => { this.props.onOpenMediaLibrary() }}>Show Media</button>
				<Editor value={this.props.value} init={{
					height: 600,
					convert_urls: false,
					link_list: async (success) => {
						success(await this.getLinks())
					},
					image_list: (success) => {
						success(this.getFiles());
					},
					plugins: 'image anchor table link lists advlists charmap emoticons wordcount fullscreen code',
					toolbar: ['undo redo | aligncenter alignjustify alignleft alignnone alignright | bold italic | numlist bullist | indent outdent | removeformat formatselect']
				}} outputFormat='html' onEditorChange={this.blah} />

			</div>
		);
	}

}

export function HTMLPreview(props) {
	return <div>TODO HTML PREVIEW</div>
}