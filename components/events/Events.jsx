import useSWR from 'swr';
import PopUpOverlay from '../PopUpOverlay';

import {getSwingLeftEvents,splitEventsIntoTimeSlot,humanizeEventType,splitTimeslotsIntoDays} from '../../lib/util';
import { useState, useEffect } from 'react';
import {v4 as uuidv4} from 'uuid';
import styles from './Events.module.css'
//function event

import {ContentBlock} from '../ContentBlock'





export function Events(props){
	let allEvents=useSWR('https://api.mobilize.us/v1/organizations/210/events?timeslot_end=gte_now', getSwingLeftEvents,{initialData:props.eventData,revalidateOnMount:true,errorRetryCount:2});
	
	const [isServer,setIsServer]=useState(true);
	
	useEffect(()=>{
		setIsServer(false);
	});
	const [selectedEventTypes,setSelectedEventTypes]=useState([]);
	let handleEventTypeChange=(etype)=>{
		if(selectedEventTypes.includes(etype)){
			setSelectedEventTypes(selectedEventTypes.filter((et)=>{return et!==etype}))
		}
		else{
			setSelectedEventTypes(selectedEventTypes.concat([etype]));
		}
	}
	const [selectedVirtual,setSelectedVirtual]=useState(false);
	let handelEventVirtualChange=()=>{
		if(selectedVirtual){
			setSelectedVirtual(false);
		}
		else{
			setSelectedVirtual(true);
		}
	};

	const [selectedPublic,setSelectedPublic]=useState(false);
	let handelEventPublicChange=()=>{
		if(selectedPublic){
			setSelectedPublic(false);
		}
		else{
			setSelectedPublic(true);
		}
	};

	const [inputZipCode,setInputZipCode]=useState('');
	let handleZipCodeChange=(input)=>{
		if(input.length<6){
			setInputZipCode(input.replace(/\D/g,''));
		}
		
	}

	const [inputMaxMiles,setInputMaxMiles]=useState('');
	let handleMaxMilesChange=(input)=>{
		setInputMaxMiles(input)
	}


	let resetCtrlInputs=()=>{
		setSelectedEventTypes([]);
		setSelectedVirtual(false);
		setSelectedPublic(false);
		setInputZipCode('')
		setInputMaxMiles('');
	}


	let shouldFetchGeoEvents=()=>{
		let miles=parseInt(inputMaxMiles);
		return inputZipCode.length===5&&inputMaxMiles!==''&&miles!==NaN&&miles>0;
	}
		

	let mobilzeUrlAdditions=()=>{
		if(shouldFetchGeoEvents()){
			return '&zipcode='+inputZipCode+'&max_dist='+inputMaxMiles;
		}
		else{
			return '';
		}	
	}

	let selectedEventsData=useSWR('https://api.mobilize.us/v1/organizations/210/events?timeslot_end=gte_now'+mobilzeUrlAdditions(), getSwingLeftEvents,{initialData:props.eventData,revalidateOnMount:true,errorRetryCount:2});


	//cleanup 
	let selectedEvents=selectedEventsData.data
	if(shouldFetchGeoEvents()&&(
		(selectedVirtual && selectedPublic) || //not needed
		(!selectedVirtual && !selectedPublic)  ||
		(selectedVirtual)
		)  ){
			console.log('merging virt with geo!')
		selectedEvents=selectedEvents.concat(allEvents.data.filter((ev)=>{
			return ev.is_virtual;
		}));
		

	}
	//console.log(selectedEventsData)
	selectedEvents=selectedEvents.filter((ev)=>{
		let eventTypeCheck=selectedEventTypes.includes(ev.event_type)||selectedEventTypes.length===0;
		let virtualAndPublicCheck=selectedVirtual===selectedPublic||ev.is_virtual&&selectedVirtual||!ev.is_virtual&&selectedPublic

		return eventTypeCheck&&virtualAndPublicCheck;
	});
	
	
	
	let eventTimeSlotsGroupedByDay=splitTimeslotsIntoDays(splitEventsIntoTimeSlot(selectedEvents),isServer);
	let ctrlMessages=[];
	if(inputZipCode!==''&&inputZipCode.length!==5){
		ctrlMessages.push({message:'ZipCode Must be 5 digits long'});
	}
	if(inputMaxMiles!==''&&inputZipCode===''){
		ctrlMessages.push({message:'You must provide a zip Code if you are providing miles'});
	}
	if(inputMaxMiles===''&&inputZipCode!==''){
		ctrlMessages.push({message:'You must provide miles  if you are providing a zip Code'});
	}
	if(eventTimeSlotsGroupedByDay.length<1){
		ctrlMessages.push({message:'No events Found please alter your queries or check back latter for new events'});
	}
	if(selectedEventsData.error!==undefined){
		ctrlMessages.push({message:'Issue finding events. Please check if the given zip code is valid or reload the page.'});
	}
	if(allEvents.error!==undefined){
		ctrlMessages.push({message:'Issue finding events. Please reload the page. If you still see this error check api status at https://mobilize.statuspage.io/'});
	}

	//fix id mess
	return (<>
		<ContentBlock kblockid={(props.secid !== undefined && props.secid  !== '') ? props.secid  : null}>
			<EventsCtrl eventData={allEvents.data} 
			selectedEventTypes={selectedEventTypes} 
			handleEventTypeChange={handleEventTypeChange}
			
			selectedVirtual={selectedVirtual}
			handelEventVirtualChange={handelEventVirtualChange}
			selectedPublic={selectedPublic}
			handelEventPublicChange={handelEventPublicChange}

			inputZipCode={inputZipCode}
			handleZipCodeChange={handleZipCodeChange}
			inputMaxMiles={inputMaxMiles}
			handleMaxMilesChange={handleMaxMilesChange}

			resetCtrlInputs={resetCtrlInputs}

			ctrlMessages={ctrlMessages}
			/>
		</ContentBlock>
		<EventList eventDataByDay={isServer ? props.eventDataByDay : eventTimeSlotsGroupedByDay}/>
		<EventsCalander eventDataByDay={isServer ? props.eventDataByDay : eventTimeSlotsGroupedByDay}/>
	</>);
}


export function EventsCtrl(props){
	let eventTypes=props.eventData.reduce((acc,curr)=>{
		if(!acc.includes(curr.event_type)){
			acc.push(curr.event_type);
		}
		return acc;
	},[]);
	
	let eventTypeCheckBoxes=eventTypes.map((etype)=>{
		return (<label key={etype}>
		
		<input type="checkbox" checked={props.selectedEventTypes.includes(etype)} onChange={()=>{
			props.handleEventTypeChange(etype);
		}}/>
		{humanizeEventType(etype)}
		</label>);
	});

	return (
		<>
		<form>
			{eventTypeCheckBoxes}
		</form>
		<form>
			<label>Virtual<input type="checkbox" checked={props.selectedVirtual} onChange={props.handelEventVirtualChange}  /></label>
			<label>Public<input type="checkbox" checked={props.selectedPublic} onChange={props.handelEventPublicChange}/></label>
		</form>
		<form>
			<label>Zipcode<input type="text" value={props.inputZipCode} onChange={(ev)=>{props.handleZipCodeChange(ev.currentTarget.value)}}/></label>
			<label>Max Miles<input type="number" value={props.inputMaxMiles} onChange={(ev)=>{props.handleMaxMilesChange(ev.currentTarget.value)}}/></label>
		</form>
		<button onClick={props.resetCtrlInputs}>Reset All</button>
		{/* <pre>{JSON.stringify({
			selectedEventTypes:props.selectedEventTypes,
			selectedVirtual:props.selectedVirtual,
			selectedPublic:props.selectedPublic,
			inputZipCode:props.inputZipCode,
			inputMaxMiles:props.inputMaxMiles
		},null,'\t')}</pre> */}
		{props.ctrlMessages.length>0&&(
			<div>
				{props.ctrlMessages.map((el,index)=>{
					return <div key={index+JSON.stringify(el)}>{el.message}</div>;
				})}
			</div>
		)}
	
		</>
		);
	
}
export function EventList(props){


	// let eventTimeSlotsGroupedByDay=splitTimeslotsIntoDays(splitEventsIntoTimeSlot(props.eventData));
	let dayArr=props.eventDataByDay.map((day)=>{
		return <EventDay key={'timeslots-'+day.etsArr.map((el)=>{return el.timeslot.id}).join(',')} day={day}/>
	});


	return (<>{dayArr}</> );
	
}
function EventsCalander(props){

	let days=props.eventDataByDay;
	//TODO set this properly to current month
	const [year,setYear]=useState(days.length > 0 ? days[0].year : 2020);
	const [month,setMonth]=useState(days.length > 0 ? days[0].month : 7);
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
//Not for serverside use (dont have opened by default)
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
	let timeFormater=new Intl.DateTimeFormat(undefined,{
		hour:'numeric',
		minute:'2-digit',
		timeZoneName:'short',
		timeZone:'America/Chicago'
	});

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
										let time=timeFormater.format(new Date(el.timeslot.start_date*1000));
									return <div key={el.timeslot.id}>{el.event.title} {time}</div>;
									});

									return <td key={day.uuid} onPointerEnter={(e)=>{
										if(e.pointerType==='mouse'||e.pointerType==='pen'){
											setCurrentDay({
												x:e.currentTarget.getBoundingClientRect().x,
												y:window.innerHeight-e.currentTarget.getBoundingClientRect().y,
												hoverText:hoverText,
												day:day
											});
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
			<button onClick={()=>{setSignup(!signup)}}>Sign Up</button>
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

				<a target="_blank" rel="noreferrer" href={'https://www.google.com/maps/dir/?api=1&destination='+
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