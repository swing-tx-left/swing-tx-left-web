import useSWR from 'swr';


import {getSwingLeftEvents,splitEventsIntoTimeSlot} from '../../lib/util';
//function event







export function Events(props){

	

	let obj=useSWR('https://api.mobilize.us/v1/organizations/210/events?timeslot_end=gte_now', getSwingLeftEvents,{initialData:props.eventData});
	
		

		return (<>
		<EventsCtrl eventData={obj.data}/>
		<EventList eventData={obj.data}/>
	</>);
			
		
		


}


export function EventsCtrl(props){
	return (
		
	
		<pre>{JSON.stringify(props.eventData.length,null,'\t')}</pre>
		
		);
	
}
export function EventList(props){
	let eventTimeSlots=splitEventsIntoTimeSlot(props.eventData);

	let eventTimeSlotsGroupedByDay=eventTimeSlots.reduce((groupedArr,curVal)=>{
		
		let etsStart=new Date(curVal.timeslot.start_date*1000).toDateString();
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
			groupedArr.push({dayStr:etsStart,etsArr:[curVal]});
		}
		return groupedArr;
	},[]);
	
	
	let dayArr=eventTimeSlotsGroupedByDay.map((day)=>{
		return <EventDay key={day.dayStr} day={day}/>
	});


return <>{dayArr}</> ;
	
}


export function EventDay(props){

	let timeslots=props.day.etsArr.map((el)=>{
		return <EventTimeSlot key={el.timeslot.id} eventTimeslot={el}/> 
	})
return <div><h2>{props.day.dayStr}</h2>{timeslots}</div>
}

export function EventTimeSlot(props){
	let event=props.eventTimeslot.event;

return <><h3>{event.title}</h3><pre>{JSON.stringify(props.eventTimeslot,null,'\t')}</pre></>
}