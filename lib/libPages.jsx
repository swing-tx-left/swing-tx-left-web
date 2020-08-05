import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {getSiteSettings} from './libSiteSettings'
import {getSwingLeftEvents} from './util'

export function getPages(){
	let pageFiles=fs.readdirSync(path.join(process.cwd(),'pagecontent'));
	let dataForAllPages =pageFiles.map((file) => {
		let pageData = yaml.safeLoad( fs.readFileSync(path.join(process.cwd(), 'pagecontent', file), 'utf-8'));
		//console.log(pageData)
		if (pageData.title===undefined) {
			pageData.title = 'No Title'
		}

		if (pageData.slug===undefined) {
			pageData.slug = path.basename(file, '.html');
		}
		pageData.url='/'+pageData.slug;
		return pageData;
	});
	//console.log(dataForAllPages);
	return dataForAllPages;
}
//const eventdata= getData('https://api.mobilize.us/v1/organizations/210/events?timeslot_end=gte_now');
export async function getProps(context){
	let pageData=getPages();
	let siteData=getSiteSettings();
	let swtxlevents= await getSwingLeftEvents('https://api.mobilize.us/v1/organizations/210/events?timeslot_end=gte_now')
	//let swtxlevents=await eventdata;
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
				 
				}),
			eventData:swtxlevents
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