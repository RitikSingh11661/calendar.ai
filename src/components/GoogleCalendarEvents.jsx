import React, { useState } from 'react'
import '../styles/GoogleCalendarEventsStyle.css'
import { useDispatch, useSelector } from 'react-redux';
import { AddGoogleCalenderThing } from './AddGoogleThing';
import { FormControl, FormLabel, IconButton, Input, Select, useToast } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Loading } from './Loading';
import { getData, resetEvents } from '../redux/App/action';
import { incrementScheduleCount } from '../redux/Auth/actions';

export const GoogleCalendarEvents = () => {
  const gapi = window.gapi;
  const { isError, data, toBeAddedEvents } = useSelector(store => store.AppReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState(['']);
  const [guestsCanSeeOtherGuests, setGuestsCanSeeOtherGuests] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();

  let eventsSuccessToast = () => {
    return toast({
      title: 'Congratulations, Events successfully scheduled',
      description: `Your Events has been scheuled in your G-calender.`,
      status: "success",
      duration: 3000,
      position: "top",
      isClosable: true,
    });
  }

  let eventsFailureToast = (error) => {
    return toast({
      title: "Sorry, Your Events failed to schedule",
      description: "Please try again after some time",
      status: "error",
      duration: 3000,
      position: "top",
      isClosable: true,
    });
  }

  const addAutoEvents = () => {
    const events = toBeAddedEvents;
    // const events = [
    //   ["Title", "Timings", "01/06/2023", "02/06/2023"],
    //   ["Exercise", "06:00-07:00", "Morning jog", "Morning jog"],
    //   ["Read Book", "13:00-13:30", "Have to read Atomic Habits", "Have to read Atomic Habits"],
    //   ["Coding", "14:00-18:00", "Learn Backend (Node.js)", "Learn Backend (Node.js)"]
    // ]; 
    // console.log('events', events);
    if (events?.length > 0) {
      setIsLoading(prev=>!prev);
      let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let finalEvents = [], header = {}, unwanted = [], time, eventsList = [], isDay = events[0].some((element) => /day/i.test(element));
      for (let i = 0; i < events.length; i++) {
        let dateRegex = /\b\d{2}\/\d{2}\/\d{4}\b/;
        if (i === 0) {
          for (let j = 0; j < events[i].length; j++) {
            let title = events[i][j];
            if (title.includes('Title') || title.includes('mings') || isDay || (!isDay && dateRegex.test(title))) {
              if (isDay && title.includes('day')) {
                let t = title.split(' ')[1].split('/');
                t = `${t[2]}-${t[1]}-${t[0]}T`
                header[j] = t;
              } else if (!isDay && dateRegex.test(title)) {
                let t = title.split('/');
                t = `${t[2]}-${t[1]}-${t[0]}T`
                header[j] = t;
              } else if (title.includes('mings')) {
                header[j] = title;
                time = j;
              } else header[j] = title;
            } else unwanted.push(j);
          }
        } else {
          let row = events[i], newRow = [];
          for (let j = 0; j < row.length; j++) {
            if (!unwanted.includes(j) && header[j]) {
              if (time === j) {
                let pattern1 = /(\d{1,2}:\d{2})\s*-\s*\d{0,1}\s*(\d{2}:\d{2})/;
                let pattern2 = /(\d{1,2}:\d{2})\s*(?:-|\s)\s*(\d{1,2}:\d{2})?/;
                let matches = []
                if (row[j].includes('-')) {
                  matches = row[j].match(pattern1);
                  let t = [matches[1], matches[2]];
                  newRow.push(t);
                }
                else {
                  matches = row[j].match(pattern2);
                  let t = [matches[1], matches[2]];
                  newRow.push(t);
                }
              } else newRow.push(row[j].trim());
            }
          }
          eventsList.push(newRow)
        }
      }
      // console.log('header', header)
      const key = Object.keys(header).find(key => /\d{4}-\d{2}-\d{2}T/.test(header[key]));
      // console.log('eventsList', eventsList)

      for (let i = 0; i < eventsList.length; i++) {
        let j = key;
        for (let m = 2; m < eventsList[i].length; m++) {
          let check = eventsList[i][m].trim(), startTime, endTime;
          let summary = eventsList[i][m], desription = `${header[0]}:- ${eventsList[i][0]}`;
          let pattern_with_dash = /^(.+?)\s+\((\d{1,2}:\d{2})(?:-(\d{1,2}:\d{2}))?\)$/;
          let pattern_with_space = /^(.+?)\s+\((\d{1,2}:\d{2})(?:\s+(\d{1,2}:\d{2}))?\)$/;
          const test = summary.match(pattern_with_dash) || summary.match(pattern_with_space);
          if (test) {
            summary = test[1];
            startTime = `${header[j]}${test[2]}:00`;
            endTime = `${header[j++]}${test[3]}:00`;
          } else {
            startTime = `${header[j]}${eventsList[i][1][0]}:00`;
            endTime = `${header[j++]}${eventsList[i][1][1]}:00`;
          }
          if (check.length > 0) {
            let singleEvent = {
              'kind': 'calendar#event',
              'summary': summary,
              'location': location,
              'description': desription,
              'start': { 'dateTime': startTime, 'timeZone': userTimeZone },
              'end': { 'dateTime': endTime, 'timeZone': userTimeZone },
              'recurrence': ['RRULE:FREQ=DAILY;COUNT=1'],
              'reminders': { 'useDefault': true },
              'attendees': attendees.map((el) => {
                if (el.trim().length > 0) return { 'email': el, 'responseStatus': 'needsAction' }
              }),
              "guestsCanSeeOtherGuests": guestsCanSeeOtherGuests,
            }
            finalEvents.push(singleEvent)
          }
        }
      }
      try {
        var batch = gapi.client.newBatch();
        finalEvents.forEach((event) => {
          batch.add(gapi.client.calendar.events.insert({ 'calendarId': 'primary', 'resource': event, 'sendUpdates': 'all' }));
        })
        batch.execute((res) => {
          dispatch(resetEvents);
          eventsSuccessToast();
          listUpcomingEvents();
        });
        incrementScheduleCount();
      } catch (error) {
        dispatch(resetEvents);
        eventsFailureToast(error)
      }
      setIsLoading(prev=>!prev);
    }
    else {
      alert('Events are empty, Kindly add some events ')
    }
  }

  const handleAttendeesChange = (index, event) => {
    const attendeesArray = [...attendees];
    attendeesArray[index] = event.target.value;
    setAttendees(attendeesArray);
  };

  const handleRemoveAttendee = (index) => {
    const updatedAttendees = [...attendees];
    updatedAttendees.splice(index, 1);
    setAttendees(updatedAttendees);
  }

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const listUpcomingEvents = async () => {
    let response;
    try {
      const request = {
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
      const events = response?.result?.items;
      dispatch(getData(events))
    } catch (err) { console.log(err) }
  }

  return (
    <div id='main-div'>
      <h2>My Events</h2>
      <form>
        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input type='text' name='location' background='#fff' htmlSize={45} width='auto' onChange={(e) => setLocation(e.target.value)} value={location} />
        </FormControl>
        <FormLabel>Attendees Email Id's</FormLabel>
        {attendees.map((email, index) => (
          <FormControl key={index} id={`attendee-email-${index}`}>
            <FormLabel>Email Id {index + 1}</FormLabel>
            <Input type="email" value={email} background='#fff' onChange={(e) => handleAttendeesChange(index, e)} />
            {index > 0 && (<IconButton icon={<DeleteIcon />} onClick={() => handleRemoveAttendee(index)} />)}
          </FormControl>
        ))}
        <IconButton aria-label='Add' margin='3px 0' icon={<AddIcon />} onClick={() => setAttendees(prev => [...prev, ''])} />
        <FormControl>
          <FormLabel>Guests can see other guests</FormLabel>
          <Select value={guestsCanSeeOtherGuests} onChange={(e) => setGuestsCanSeeOtherGuests(e.target.value)}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Select>
        </FormControl>
      </form>
      <AddGoogleCalenderThing title={'Add Events'} onClick={addAutoEvents} />
      <div className="events-container">
        {isLoading && <Loading />}
        {isError && <h2>Error Occured while showing events</h2>}
        {data?.length === 0 && <p>No Events yet</p>}
        {data?.length > 0 && data.map((event) => (
          <div className="event" key={event?.id}>
            <h3 className="event-title">{event?.summary}</h3>
            <p className="event-description">{event?.description?.length > 50 ? event?.description.slice(0, 50) + '...' : event?.description}</p>
            <p className="event-date">{formatDate(event?.start.dateTime || event?.start.date)}</p>
          </div>
        ))}
      </div>
    </div >
  )
}
