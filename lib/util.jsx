import rehypeReact from 'rehype-react';
import unified from 'unified';
import rehypeParse from 'rehype-parse';
import React from 'react';
import {v4 as uuidv4} from 'uuid';

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

export async function getData(url){
	let res=await fetch(url,{
		referrerPolicy:'no-referrer'
	});
	let eventArr=[];
	let theJson=await res.json();
	console.log(url);
	eventArr=theJson.data;
	if(theJson.next!==null){
		console.log('fetching more');
		eventArr=eventArr.concat(await getData(theJson.next));
	}
	else{
		console.log('fetched all');
	}
	return eventArr;
}

export async function getSwingLeftEvents(urlAdd,mobilizeOrgs){
	let events=[];
	for(let morg of mobilizeOrgs){
			let theData=await getData(morg.url+urlAdd);
			console.log(theData);
			let selectedEvents=theData;
			if(morg.regexp!==undefined&&morg.regexp.length>0){
				selectedEvents=selectedEvents.filter(filterEventsOnRegExp(morg))
			}
			events=events.concat(selectedEvents);
	}

	return events;
}


export function splitEventsIntoTimeSlot(events){
	let timeSlotArray=[]
	for(let e of events){
		for(let ets of e.timeslots){
			let timeSlotObj={
				timeslot:ets,
				event:e
			};
			timeSlotArray.push(timeSlotObj);
		}
	}
	return timeSlotArray.sort((fel,sel)=>{
		return fel.timeslot.start_date-sel.timeslot.start_date;
	});
}
export function splitTimeslotsIntoDays(eventTimeSlots,isServer=true){
	let dateFormater;
	if(isServer){
		dateFormater=new Intl.DateTimeFormat('en-US',{
			weekday:'short',
			year:'numeric',
			month:'short',
			day:'2-digit',
			timeZone:'America/Chicago'
		});
	}
	else{
		dateFormater=new Intl.DateTimeFormat(undefined,{
			weekday:'short',
			year:'numeric',
			month:'short',
			day:'2-digit',
		});
	}


	return eventTimeSlots.reduce((groupedArr,curVal)=>{
		let date=new Date(curVal.timeslot.start_date*1000);
		let dateParts=dateFormater.formatToParts(date).reduce((parts,cur)=>{
			parts[cur.type]=cur.value;
			return parts;
		},{});
		let etsStart=`${dateParts.weekday} ${dateParts.month} ${dateParts.day} ${dateParts.year}`;
		let dateExistAlready=groupedArr.some((el)=>{
			return el.dayStr===etsStart;
		});
		if(dateExistAlready){
			let dateLocation=groupedArr.findIndex((el)=>{
				return el.dayStr===etsStart
			});
			groupedArr[dateLocation].etsArr.push(curVal);
		}
		else{
			groupedArr.push({
				dayStr:etsStart,
				month:date.getMonth(),
				day:date.getDate(),
				year:date.getFullYear(),
				uuid:uuidv4(),
				etsArr:[curVal]
			});
		}
		return groupedArr;
	},[]);
}
function filterEventsOnRegExp(morg){
	// let swingtxleftRegExp=/swing\s*tx\s*left/i;
	// let stxlRegExp=/STXL/i;

	let regexpArr =morg.regexp.map((el)=>{
		return new RegExp(el.pattern,el.flags);
	});
	return (event,index,arr)=>{
		//maybe a bit ugly?
		let regexpArrMatch=(str)=>{
			return regexpArr.some((r)=>{
				return event.title.search(r)!==-1;
			});
		};
		if(regexpArrMatch(event.title)){
			return true;
		}
		else if(regexpArrMatch(event.description)){
			return true;
		}
		return false;
	}
	
}

export function humanizeEventType(eventType,options={}){
	if(!options.hasOwnProperty('forForm')){
		options.forForm=false;
	}

	if(eventType==='MEET_GREET'){
		return 'Meet & Greet'
	}
	if(eventType==='VOTER_REG'){
		return 'Voter Registration'
	}
	if(options.forForm&&eventType==='OTHER'){
		return 'Other (includes literature drops)'
	}

	let words=eventType.split('_');

	words=words.map((w)=>{
		w=w.toLowerCase();
		w=w[0].toUpperCase()+w.substring(1);
		return w;
	});

	return words.join(' ');


}