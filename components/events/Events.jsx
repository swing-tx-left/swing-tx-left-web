import useSWR from 'swr';
import PopUpOverlay from '../PopUpOverlay';

import {getSwingLeftEvents,splitEventsIntoTimeSlot,humanizeEventType,splitTimeslotsIntoDays} from '../../lib/util';
import { useState, useEffect } from 'react';
import {v4 as uuidv4} from 'uuid';
import styles from './Events.module.css'
//function event

import {ContentBlock} from '../ContentBlock'





export function Events(props){
	let obj=useSWR('https://api.mobilize.us/v1/organizations/210/events?timeslot_end=gte_now', getSwingLeftEvents,{initialData:props.eventData,revalidateOnMount:true});
	const [isServer,setIsServer]=useState(true)
	useEffect(()=>{
		setIsServer(false);
	});
	let eventTimeSlotsGroupedByDay=splitTimeslotsIntoDays(splitEventsIntoTimeSlot(obj.data),isServer);
		//fix id mess
	return (<React.Fragment>
		<ContentBlock kblockid={(props.secid !== undefined && props.secid  !== '') ? props.secid  : null}>
			<EventsCtrl eventData={obj.data}/>
		</ContentBlock>
		<EventList eventDataByDay={isServer ? props.eventDataByDay : eventTimeSlotsGroupedByDay}/>
		<EventsCalander eventDataByDay={isServer ? props.eventDataByDay : eventTimeSlotsGroupedByDay}/>
	</React.Fragment>);
}


export function EventsCtrl(props){
	return (
		
	
		<pre>Event controls go here {JSON.stringify(props.eventData.length,null,'\t')}</pre>
		
		);
	
}
export function EventList(props){


	// let eventTimeSlotsGroupedByDay=splitTimeslotsIntoDays(splitEventsIntoTimeSlot(props.eventData));
	let dayArr=props.eventDataByDay.map((day)=>{
		return <EventDay key={day.uuid} day={day}/>
	});


return (<>{dayArr}</> );
	
}
function EventsCalander(props){

	let days=props.eventDataByDay;
	const [year,setYear]=useState(days[0].year);
	const [month,setMonth]=useState(days[0].month);
	const [displayCal,setDisplayCal]=useState(false);
	let previousMonth=()=>{
				if(month===0){
					setYear(year-1);
					setMonth(11);
				}
				else{
					setMonth(month-1);
				}
			}
	let nextMonth=()=>{
				if(month===11){
					setYear(year+1);
					setMonth(0);
				}
				else{
					setMonth(month+1);
				}
			}
	return (
		<div className={styles.eventQuickCalander}>
			{
				displayCal ? <button className={styles.eventQuickCalanderButton} onClick={()=>{setDisplayCal(false)}}>Hide Calander</button>:<button className={styles.eventQuickCalanderButton} onClick={()=>{setDisplayCal(true)}}>Jump to Day...</button>
			}
			{displayCal&&(<>
			
		
		
			{/* <button onClick={pastMonth}>Month-</button>
			<button onClick={nextMonth}>Month+</button>	 */}
			<EventsMonth nextMonthFunction={nextMonth} previousMonthFunction={previousMonth}  days={days.filter((day)=>{
				return day.month===month&&day.year===year;
			})} month={month} year={year}/>
			</>)}
			
		</div>
	);
}
//Not for serverside use
function EventsMonth(props){
	let daysInMonth=[];
	let weeks=[];
	const [currentDay,setCurrentDay]=useState(null);
	for (let d=new Date(props.year,props.month,1);d.getMonth()===props.month;
	d=new Date((new Date(d)).setDate(1+d.getDate()))){			
		daysInMonth.push(d);
	}	
	let curWeek=0;
	for (let d of daysInMonth){
		if(d.getDate()===1){
				let pastMonthDays=new Array(d.getDay());
				pastMonthDays=pastMonthDays.fill({
					type:'blank',
				}).map((el)=>{
					return {...el,uuid:uuidv4()};
				});
				weeks.push(pastMonthDays.concat([{
					type:'day',
					date:d,
					uuid:uuidv4()
				}]));
		}
		else{
			if(weeks[curWeek].length>6){
				weeks.push([]);
				curWeek=curWeek+1;
			}
			weeks[curWeek].push({
				type:'day',
				date:d,
				uuid:uuidv4()
			});
		}
	}
	
	let nextMonthsDays=new Array(7-weeks[curWeek].length);
	nextMonthsDays=nextMonthsDays.fill({
		type:'blank'
	}).map((el)=>{
		return {...el,uuid:uuidv4()};
	});
	weeks[curWeek].push(...nextMonthsDays)
	let monthNameArr=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];


	return (<>
		<div className={styles.eventQuickMonthBlock}>
			
	
		<div className={styles.eventQuickMonthTitle}>{monthNameArr[props.month]} {props.year}</div>
		{/* <pre>{JSON.stringify(weeks,null,'\t')}</pre> */}
			<table className={styles.eventQuickMonth}>
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
					{weeks.map((week)=>{
						return(	
								<tr key={'week-of-'+week[0].uuid}>
							{week.map((day)=>{
								if(day.type==='blank'){
									return <td key={day.uuid}></td>
								}
								else if(props.days.some((el)=>{return day.date.getDate()===el.day;})){
									let hoverText=props.days.find((el)=>{
										return day.date.getDate()===el.day
									}).etsArr.map((el)=>{
										return <div key={el.timeslot.id}>{el.event.title} </div>;
									});

									return <td key={day.uuid} onPointerEnter={(e)=>{
										if(e.pointerType==='mouse'||e.pointerType==='pen'){
											setCurrentDay({
												x:e.currentTarget.getBoundingClientRect().x,
												y:window.innerHeight-e.currentTarget.getBoundingClientRect().y,
												hoverText:hoverText,
												day:day
											});
										console.log(day)
										}
										
									}}
									onPointerLeave={()=>{
										setCurrentDay(null);
									}}
									
									>
										
										<a href={'#eventday-'+day.date.getMonth()+'-'+day.date.getDate()+'-'+day.date.getFullYear()}>{day.date.getDate()}</a>
									
									
									</td>
								}
								else{
									return <td title={day.uuid} key={day.uuid}>{day.date.getDate()}</td>
								}

								
							})}
						</tr>
						)
					
					})}
				
				</tbody>
			</table>	
			<div  className={styles.eventQuickMonthButtonRow}>


				<button className={styles.eventQuickMonthButton} onClick={()=>{
					setCurrentDay(null);
					props.previousMonthFunction();
					
				}}>Previous</button>


				<button className={styles.eventQuickMonthButton} onClick={()=>{
					setCurrentDay(null);
					props.nextMonthFunction();
				}}>Next</button>


		</div>
	
			{currentDay!==null&&
			
				<div style={{bottom:currentDay.y,left:currentDay.x}} className={styles.dayPreview}>
					<div className={styles.dayPreviewDay}> {currentDay.day.date.getDate()}
					</div>
					{currentDay.hoverText}
				</div>
			
			}
	</div>
	</>);

}


export function EventDay(props){

	let timeslots=props.day.etsArr.map((el)=>{
		return <EventTimeSlot key={el.timeslot.id} eventTimeSlot={el}/> 
	})
	return (<ContentBlock blockid={'eventday-'+props.day.month+'-'+props.day.day+'-'+props.day.year}>
		<h2>{props.day.dayStr}</h2>{timeslots}
		</ContentBlock>)
}

export function EventTimeSlot(props){
	const [signup,setSignup]=useState(false);
	let event=props.eventTimeSlot.event;
	const [isServer,setIsServer]=useState(true)
	useEffect(()=>{
		setIsServer(false);
	});
	let dateFormater

	if(isServer){
		dateFormater=new Intl.DateTimeFormat('en-US',{
			weekday:'long',
			//era:'short',
			year:'numeric',
			month:'long',
			day:'numeric',
			hour:'numeric',
			minute:'2-digit',
			timeZoneName:'short',
			timeZone:'America/Chicago'
		});
	}
	else{
		dateFormater=new Intl.DateTimeFormat(undefined,{
			weekday:'long',
			//era:'short',
			year:'numeric',
			month:'long',
			day:'numeric',
			hour:'numeric',
			minute:'2-digit',
			timeZoneName:'short'
		});
	}

	let startDate=new Date(props.eventTimeSlot.timeslot.start_date*1000);
	let endDate=new Date(props.eventTimeSlot.timeslot.end_date*1000)

	return (<div>
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
	</div>);
}

function OtherTimeslots(props){
	const [isServer,setIsServer]=useState(true)
	useEffect(()=>{
		setIsServer(false);
	});
	let dateFormater
	
	if(isServer){
		dateFormater=new Intl.DateTimeFormat('en-US',{
		weekday:'long',
		//era:'short',
		year:'numeric',
		month:'long',
		day:'numeric',
		hour:'numeric',
		minute:'2-digit',
		timeZoneName:'short',
		timeZone:'America/Chicago',

	});
	}
	else{
		dateFormater=new Intl.DateTimeFormat(undefined,{
			weekday:'long',
			//era:'short',
			year:'numeric',
			month:'long',
			day:'numeric',
			hour:'numeric',
			minute:'2-digit',
			timeZoneName:'short',
		});
	}
		
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
			{(event.address_visibility==='PUBLIC') && (<>

				<a href={'https://www.google.com/maps/dir/?api=1&destination='+
				encodeURIComponent(	event.location.address_lines.join(' ')+' '+
				event.location.locality+', '+
				event.location.region+' '+
				event.location.postal_code)}>Directions</a> 

				{event.location.address_lines.map((el,index,arr)=>{
					return <div key={index}>{el}</div>;
				})}

				<div>{event.location.locality}, {event.location.region} {event.location.postal_code}</div>

				</>)}	




	</>);
}

function EventDescription(props){
	return <div>{props.content}</div>
}

function EventField(props){
	return (<div><b>{props.field}: </b><span>{props.children}</span></div>);
}