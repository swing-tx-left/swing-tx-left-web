import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {getSiteSettings} from './libSiteSettings'
import {getSwingLeftEvents,splitEventsIntoTimeSlot,humanizeEventType,splitTimeslotsIntoDays} from './util';
import {v4 as uuidv4} from 'uuid';


export function getPages(){
	let pageFiles=fs.readdirSync(path.join(process.cwd(),'pagecontent'));
	let dataForAllPages =pageFiles.map((file) => {
		let pageData = yaml.load( fs.readFileSync(path.join(process.cwd(), 'pagecontent', file), 'utf-8'));
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
		//pageData.content=await giveEachSectionNeeededData(pageData.content)

		return pageData;
		

	});
	
	//console.log(dataForAllPages);
	return dataForAllPages;
}

async function giveEachSectionNeeededData(content,siteData){
	return await Promise.all(content.map(async (sec)=>{
		let dataAddedSec={...sec, uuid:uuidv4()};
		if(dataAddedSec.type==='sections-with-toc'){
			dataAddedSec.sections=await giveEachSectionNeeededData(dataAddedSec.sections,siteData);
		}
		if(dataAddedSec.type==='events'){
			let swtxlevents= await getSwingLeftEvents('',siteData.mobilizeOrgs);
			let swtxleventsByDay=splitTimeslotsIntoDays(splitEventsIntoTimeSlot(swtxlevents));
			dataAddedSec={...dataAddedSec, eventData: swtxlevents,eventDataByDay:swtxleventsByDay};
		}

		return dataAddedSec;
	}));
}

//const eventdata= getData('https://api.mobilize.us/v1/organizations/210/events?timeslot_end=gte_now');
export async function getProps(context){
	let pageData=await getPages();
	let siteData=getSiteSettings();
	//let swtxlevents= await getSwingLeftEvents('https://api.mobilize.us/v1/organizations/210/events?timeslot_end=gte_now');
	//let swtxleventsByDay=splitTimeslotsIntoDays(splitEventsIntoTimeSlot(swtxlevents));
	//let swtxlevents=await eventdata;
	let page=pageData.find((el)=>{
			if(context.params.pageid===undefined){
				return el.slug===siteData.home
			}
			else{
				return el.slug===context.params.pageid.join('/');
			}
		});

	page.content=await giveEachSectionNeeededData(page.content,siteData);
	return {
		props:{
			siteData:siteData,
			pageData:page
			//eventData:swtxlevents,
			//eventDataByDay:swtxleventsByDay
		}
		
	}
}

export async function getPaths(){
	let pages = getPages();
	return {
		paths: pages.map((el) => {
			return el.url;
		}).concat(['/']),
		fallback: false
	}
}