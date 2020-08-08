import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {getSiteSettings} from './libSiteSettings'
import {getSwingLeftEvents,splitEventsIntoTimeSlot,humanizeEventType,splitTimeslotsIntoDays} from './util';
import {v4 as uuidv4} from 'uuid';


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
		
		if(pageData.content===undefined){
			pageData.content=[];
		}
		pageData.content=giveEachSectionUUID(pageData.content)

		return pageData;
		

	});
	//console.log(dataForAllPages);
	return dataForAllPages;
}

function giveEachSectionUUID(content){
	return content.map((sec)=>{
		let uuidsec={...sec, uuid:uuidv4()};
		if(uuidsec.type==='sections-with-toc'){
			uuidsec.sections=giveEachSectionUUID(uuidsec.sections);
		}
		return uuidsec;
	});
}

//const eventdata= getData('https://api.mobilize.us/v1/organizations/210/events?timeslot_end=gte_now');
export async function getProps(context){
	let pageData=getPages();
	let siteData=getSiteSettings();
	let swtxlevents= await getSwingLeftEvents('https://api.mobilize.us/v1/organizations/210/events?timeslot_end=gte_now');
	let swtxleventsByDay=splitTimeslotsIntoDays(splitEventsIntoTimeSlot(swtxlevents));
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
			eventData:swtxlevents,
			eventDataByDay:swtxleventsByDay
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