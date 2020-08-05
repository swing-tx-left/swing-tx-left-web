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

export async function getSwingLeftEvents(queryURL){
	let theData=await getData(queryURL);
	console.log(theData);
	let swingtxleftEvents=theData.filter(filterOnlySwingTXLeft);
	return swingtxleftEvents;
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

function filterOnlySwingTXLeft(event,index,arr){
	let swingtxleftRegExp=/swing\s*tx\s*left/i;
	let stxlRegExp=/STXL/i;
	if(event.title.search(swingtxleftRegExp)!==-1||event.title.search(stxlRegExp)!==-1){
		return true;
	}
	else if(event.description.search(swingtxleftRegExp)!==-1||event.description.search(stxlRegExp)!==-1){
		return true;
	}
	return false;
}