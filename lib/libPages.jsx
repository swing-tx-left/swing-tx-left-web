import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {getSiteSettings} from './libSiteSettings'

export function getPages(){
	let pageFiles=fs.readdirSync(path.join(process.cwd(),'pagecontent'));
	let dataForAllPages =pageFiles.map((file) => {
		let pageData = yaml.safeLoad( fs.readFileSync(path.join(process.cwd(), 'pagecontent', file), 'utf-8'));
		console.log(pageData)
		if (pageData.title===undefined) {
			pageData.title = 'No Title'
		}

		if (pageData.slug===undefined) {
			pageData.slug = path.basename(file, '.html');
		}
		pageData.url='/'+pageData.slug;
		return pageData;
	});
	console.log(dataForAllPages);
	return dataForAllPages;
}

export function getProps(context){
	let pageData=getPages()
	let siteData=getSiteSettings()
	return {
		props:{
			siteData:siteData,
			pageData:pageData.find((el)=>{
					if(context.params.pageid===undefined){
						return el.slug===siteData.home
					}
					else{
						return el.slug===context.params.pageid.join('/');
					}
				 
				})
		}
		
	}
}

export function getPaths(){
	let pages = getPages();
	return {
		paths: pages.map((el) => {
			return el.url;
		}).concat(['/']),
		fallback: false
	}
}