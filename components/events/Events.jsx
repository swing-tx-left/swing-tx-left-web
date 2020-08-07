import useSWR from 'swr';
import PopUpOverlay from '../PopUpOverlay';

import {getSwingLeftEvents,splitEventsIntoTimeSlot,humanizeEventType,splitTimeslotsIntoDays} from '../../lib/util';
import { useState } from 'react';

import styles from './Events.module.css'
//function event

import {ContentBlock} from '../ContentBlock'





export function Events(props){

	

	let obj=useSWR('https://api.mobilize.us/v1/organizations/210/events?timeslot_end=gte_now', getSwingLeftEvents,{initialData:props.eventData,revalidateOnMoun:true});
	
		
		//fix id mess
		return (<>
		<ContentBlock id={(props.secid !== undefined && props.secid  !== '') ? props.secid  : null}>

			<EventsCtrl eventData={obj.data}/>
		</ContentBlock>
		<EventList eventData={obj.data}/>
		<EventsCalander eventData={obj.data}/>
	</>);
			
		
		


}


export function EventsCtrl(props){
	return (
		
	
		<pre>Event controls go here {JSON.stringify(props.eventData.length,null,'\t')}</pre>
		
		);
	
}
export function EventList(props){
	let eventTimeSlots=splitEventsIntoTimeSlot(props.eventData);

	let eventTimeSlotsGroupedByDay=splitTimeslotsIntoDays(eventTimeSlots);
	
	
	let dayArr=eventTimeSlotsGroupedByDay.map((day)=>{
		return <EventDay key={day.dayStr} day={day}/>
	});


return <>{dayArr}</> ;
	
}
function EventsCalander(props){

	let days=splitTimeslotsIntoDays(splitEventsIntoTimeSlot(props.eventData));
	const [year,setYear]=useState(days[0].year);
	const [month,setMonth]=useState(days[0].month);
	const [displayCal,setDisplayCal]=useState(false);
	return (<>
		<div style={{position:'sticky',bottom:0,backgroundColor:'lightgreen'}}>
			{
				displayCal ? <button onClick={()=>{setDisplayCal(false)}}>Hide Calander</button>:<button onClick={()=>{setDisplayCal(true)}}>Jump to Day...</button>
			}
			{displayCal&&(<>
				
			<EventsMonth days={days.filter((day)=>{
				return day.month===month&&day.year===year;
			})} month={month} year={year}/>
			<button onClick={()=>{
				if(month===0){
					setYear(year-1);
					setMonth(11);
				}
				else{
					setMonth(month-1);
				}
			}}>Month-</button>
			<button onClick={()=>{
				if(month===11){
					setYear(year+1);
					setMonth(0);
				}
				else{
					setMonth(month+1);
				}
			}}>Month+</button>
			</>)}
			
		</div>
	</>);
}
function EventsMonth(props){
	let daysInMonth=[];
	let weeks=[];
	for (let d=new Date(props.year,props.month,1);d.getMonth()===props.month;d=new Date(d.getTime()+(24*60*60*1000))){			
		daysInMonth.push(d);
	}
	let curWeek=0;
	for (let d of daysInMonth){
		if(d.getDate()===1){
				let pastMonthDays=new Array(d.getDay());
				pastMonthDays.fill({
					type:'blank'
				});
				weeks.push(pastMonthDays.concat([{
					type:'day',
					date:d
				}]));
			
		
			
		}
		else{
			if(weeks[curWeek].length>6){
				weeks.push([]);
				curWeek++;
			}
				weeks[curWeek].push({
					type:'day',
					date:d
				});
		}
	}

	let nextMonthsDays=new Array(7-weeks[curWeek].length);
	nextMonthsDays.fill({
		type:'blank'
	});
	weeks[curWeek].push(...nextMonthsDays)


	return (<>
		<div>{props.month+1}/{props.year}</div>
		{/* <pre>{JSON.stringify(weeks,null,'\t')}</pre> */}
		<table className={styles.eventQuickCalander}>
			<thead>
				<tr>
					<td>Sun</td>
					<td>Mon</td>
					<td>Tues</td>
					<td>Wed</td>
					<td>Thurs</td>
					<td>Fri</td>
					<td>Sat</td>
				</tr>
			</thead>
			<tbody>
				{weeks.map((week,weekIndex)=>{
					return(
							<tr key={weekIndex}>
						{week.map((day,index)=>{
							if(day.type==='blank'){
								return <td key={index}></td>
							}
							else if(props.days.some((el)=>{return day.date.getDate()===el.day;})){
								let hoverText=props.days.find((el)=>{
									return day.date.getDate()===el.day
								}).etsArr.map((el,index)=>{
									return <div key={index}>{el.event.title}</div>;
								});

								return <td key={index}>
									<div className={styles.dayPreview}>
										<div className={styles.dayPreviewDay}> {day.date.getDate()}</div>
								{hoverText}
								</div>
									<a href={'#eventday-'+day.date.getMonth()+'-'+day.date.getDate()+'-'+day.date.getFullYear()}>{day.date.getDate()}</a>
								
								
								</td>
							}
							else{
								return <td key={index}>{day.date.getDate()}</td>
							}

							
						})}
					</tr>
					)
				
				})}
			
			</tbody>
		</table>
	</>);

}


export function EventDay(props){

	let timeslots=props.day.etsArr.map((el)=>{
		return <EventTimeSlot key={el.timeslot.id} eventTimeSlot={el}/> 
	})
	return (<ContentBlock id={'eventday-'+props.day.month+'-'+props.day.day+'-'+props.day.year}>
		<h2>{props.day.dayStr}</h2>{timeslots}
		</ContentBlock>)
}

export function EventTimeSlot(props){
	const [signup,setSignup]=useState(false);
	let event=props.eventTimeSlot.event;
	let dateFormater=new Intl.DateTimeFormat(undefined,{
		weekday:'long',
		//era:'short',
		year:'numeric',
		month:'long',
		day:'numeric',
		hour:'numeric',
		minute:'2-digit',
		timeZoneName:'short'

	});
	let startDate=new Date(props.eventTimeSlot.timeslot.start_date*1000);
	let endDate=new Date(props.eventTimeSlot.timeslot.end_date*1000)

	return (<>
			<h3>{event.title}</h3>
			<div>
			{event.is_virtual && (<span>Virtual</span>)} {humanizeEventType(event.event_type)}
			</div>
			<EventField field="Starts">{dateFormater.format(startDate)}</EventField>
			<EventField field="Ends">{dateFormater.format(endDate)}</EventField>
			{event.timeslots.length>1 && (<OtherTimeslots timeslots={event.timeslots.filter((t)=>{
				return t.start_date !== props.eventTimeSlot.timeslot.start_date && t.end_date !== props.eventTimeSlot.timeslot.end_date
			})}/>)}

			{event.location!==null &&<EventLocation event={event}/>}


			<EventDescription content={event.description}/>
			<button onClick={()=>{setSignup(!signup)}}>Submit</button>
			<PopUpOverlay closeFunction={()=>{setSignup(false)}} display={signup}>
				 <iframe style={{width:'100%',height:'100%',border:0}} src={event.browser_url}/>
			</PopUpOverlay>

			<details><summary>Debug</summary><pre>{JSON.stringify(props.eventTimeSlot,null,'\t')}</pre></details>
	</>);
}

function OtherTimeslots(props){
	let dateFormater=new Intl.DateTimeFormat(undefined,{
		weekday:'long',
		//era:'short',
		year:'numeric',
		month:'long',
		day:'numeric',
		hour:'numeric',
		minute:'2-digit',
		timeZoneName:'short'

	});
	let listItems=props.timeslots.map((t)=>{
		return <li key={t.start_date+' '+t.end_date}>{dateFormater.format(t.start_date*1000)}</li>
	});
	return (
			<details>
				<summary>Additional Times</summary>
				<ul>{listItems}</ul>
			</details>
	);
}

function EventLocation(props){
	let event=props.event;
	let googlemapurl='https://www.google.com/maps/dir/?api=1';
	let address=event.location.address_lines.join(' ')+' '+event.location.locality+', '+event.location.region+' '+event.location.postal_code
			googlemapurl=googlemapurl+'&destination='+encodeURIComponent(address);
	return (<>
			{event.address_visibility==='PUBLIC' ? (
				<EventField field="Location">{event.location.venue}</EventField>
			)
			: (<EventField field="Location">Sign Up for the location</EventField>)
			} 
			{(event.address_visibility==='PUBLIC') && <>

				<a href={'https://www.google.com/maps/dir/?api=1&destination='+
				encodeURIComponent(	event.location.address_lines.join(' ')+' '+
				event.location.locality+', '+
				event.location.region+' '+
				event.location.postal_code)}>Directions</a> 

				{event.location.address_lines.map((el,index,arr)=>{
					return <div key={index}>{el}</div>;
				})}

				<div>{event.location.locality}, {event.location.region} {event.location.postal_code}</div>

			</>	}	




	</>);
}

function EventDescription(props){
	return <div>{props.content}</div>
}

function EventField(props){
	return (<div><b>{props.field}: </b><span>{props.children}</span></div>);
}