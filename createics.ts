    //TODO: Make sure code works (there seem to be problems with "course" and subtracting
    //      startDate from endDate). Primary function currently starts on line 48.
    //TODO: Get each created event to output onto a string/file so that we can get an ICS file
    //      as a result of running the program.
    //NOTES: All the commented-out code can be ignored, they are just helpful templates/ideas 
    //       for creating iCalendar events and printing an ICS-formatted string


//Read in File
// const path = "/path/to/file.txt";
// const file = Bun.file(path);

// const text = await file.text();
// // string
import { CalTransfer } from './transfer';


// Create an iCalendar event:
import * as ics from 'ics';

// const event = {
//   start: [2018, 5, 30, 6, 30], //year, month, day, 6?, 30?
//   duration: { hours: 6, minutes: 30 },
//   title: 'Carl\'s Calendar',
//   description: 'Annual 10-kilometer run in Boulder, Colorado',
//   location: 'Folsom Field, University of Colorado (finish line)',
//   url: 'http://www.bolderboulder.com/',
//   geo: { lat: 40.0095, lon: 105.2669 },
//   categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
//   status: 'CONFIRMED',
//   busyStatus: 'BUSY',
//   organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
//   attendees: [
//     { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
//     { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
//   ]
// }

// ics.createEvent(event, (error, value) => {
//   if (error) {
//     console.log(error)
//     return
//   }

//   console.log(value)
// })

function toWhatever(classes: CalTransfer[]) {
    for (const course of classes) {
        for (const time of course) {
            const [days, duration, location] = course.times[time].split('|')
            let name = course.name
            let startDate = course.start
            let endDate = course.end
            const classDuration = endDate - startDate

            const [startTime, startMeridian, hyphen, endTime, endMeridian] = duration.split(' ')
            
            // Split startTime and endtime into the hours and minutes to input into ICS "duration" field
            // let totalDuration = new Date(Math.abs(endTime - startTime)) //times are currently strings!

            const event = {
            start: [startDate], //year, month, day, hour, min //CHANGE to make dynamic
            duration: { classDuration },
            title: name,
            description: '',
            location: location,
            url: '',
            geo: {},
            categories: [],
            status: '',
            busyStatus: 'BUSY',
            organizer: {},
            attendees: [{}]
            }
        }   
    }

    //TEMPLATE BELOW (what Isaac started with before adapting to Workday schedule:)
    // const event = {
    //   start: [2018, 5, 30, 6, 30], //year, month, day, 6?, 30?
    //   duration: { hours: 6, minutes: 30 },
    //   title: 'Carl\'s Calendar',
    //   description: 'Annual 10-kilometer run in Boulder, Colorado',
    //   location: 'Folsom Field, University of Colorado (finish line)',
    //   url: 'http://www.bolderboulder.com/',
    //   geo: { lat: 40.0095, lon: 105.2669 },
    //   categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
    //   status: 'CONFIRMED',
    //   busyStatus: 'BUSY',
    //   organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
    //   attendees: [
    //     { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
    //     { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
    //   ]
    // }
}

// return  "BEGIN:VCALENDAR\n" + 
//         "VERSION:2.0\n" +
//         "CALSCALE:GREGORIAN\n" +
//         "PRODID:carl/ics\n" +
//         "METHOD:PUBLISH\n" +
//         "X-PUBLISHED-TTL:PT1H\n" +
//         "BEGIN:VEVENT\n" +
//         "UID:a6PdgV6Pxt4LVLNvVL_pJ\n" + //unique id UID:20260410T120000-uniqueid@yourdomain.com
//         // "UID:" + Date.now + "@carleton.edu" +
//         "SUMMARY:Dinner\n" +
//         "DTSTAMP:20260410T232755Z\n" +
//         "DTSTART:20180115T123000Z\n" +
//         "DESCRIPTION:Nightly thing I do\n" +
//         "X-MICROSOFT-CDO-BUSYSTATUS:FREE\n" +
//         "DURATION:PT50M\n" +
//         "END:VEVENT\n" +
//         "END:VCALENDAR\n"

//Write an iCalendar file:
// const { writeFileSync } = require('fs')

// ics.createEvent({
//   title: 'Carleton Calendar',
//   description: 'Class',
//   busyStatus: 'FREE',
//   start: [2018, 1, 15, 6, 30], //year, month, day, hr?, minute?
//   duration: { minutes: 50 }
// }, (error, value) => {
//   if (error) {
//     console.log(error)
//   }

//   writeFileSync(`${__dirname}/event.ics`, value)
// BEGIN:VCALENDAR
// VERSION:2.0
// CALSCALE:GREGORIAN
// PRODID:adamgibbons/ics
// METHOD:PUBLISH
// X-PUBLISHED-TTL:PT1H
// BEGIN:VEVENT
// UID:a6PdgV6Pxt4LVLNvVL_pJ
// SUMMARY:Dinner
// DTSTAMP:20260410T232755Z
// DTSTART:20180115T123000Z
// DESCRIPTION:Nightly thing I do
// X-MICROSOFT-CDO-BUSYSTATUS:FREE
// DURATION:PT50M
// END:VEVENT
// END:VCALENDAR
//

/*
You cannot use fs in Frontend libraries like React so you rather import a module to save files 
to the browser as follow [  import { saveAs } from 'file-saver'; // For saving the file in the browser]
const blob = new Blob([value], { type: 'text/calendar' });
        saveAs(blob, `${title}.ics`);
*/
// })