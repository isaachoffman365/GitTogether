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
import { RRule } from "rrule";
import { type CalTransfer } from "./transfer";

// Create an iCalendar event:
import * as ics from "ics";

enum Weekday {
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
}

type WeekPair = [string, Weekday];

const weekPairs: WeekPair[] = [
  ["TH", Weekday.Thursday],
  ["M", Weekday.Monday],
  ["W", Weekday.Wednesday],
  ["F", Weekday.Friday],
];

function calcMeridian(
  hour: number,
  minute: number,
  meridian: string,
): [number, number] {
  const isAm = meridian.includes("AM");
  if (hour == 12 && isAm) {
    return [0, minute];
  } else if (isAm || hour == 12) {
    return [hour, minute];
  } else {
    return [hour + 12, minute];
  }
}

export async function writeCalendarFile(
  classes: CalTransfer[],
): Promise<string | undefined> {
  let events: ics.EventAttributes[] = [];
  for (const course of classes) {
    const repeatRule = new RRule({
      freq: RRule.WEEKLY,
      interval: 1,
      until: course.end,
    })
      .toString()
      .replace(/^RRULE:/, "");
    for (const time of course.times) {
      const [days, duration, location] = time.split("|");

      if (!days || !duration) {
        console.error("Bad days or duration");
        return undefined;
      }

      let allDays: Weekday[] = [];
      for (const [dayTxt, day] of weekPairs) {
        if (days.includes(dayTxt)) {
          allDays.push(day);
        }
      }
      if (days.replaceAll("TH", "").includes("T")) {
        allDays.push(Weekday.Tuesday);
      }

      for (const day of allDays) {
        const firstClassDate = new Date(course.start.getTime()); // always clone a date when you change it
        firstClassDate.setDate(firstClassDate.getDate() + +day); // Unary plus operator, gets as int

        const [startTime, startMeridian, _hyphen, endTime, endMeridian] =
          duration.trim().split(" ");

        if (!startTime || !endTime || !startMeridian || !endMeridian) {
          console.error(
            "Undefined original time",
            startTime,
            endTime,
            startMeridian,
            endMeridian,
          );
          return undefined;
        }

        const [startHourRaw, startMinuteRaw] = startTime
          ?.trim()
          .split(":")
          .map((v) => Number(v?.trim()));

        const [endHourRaw, endMinuteRaw] = endTime
          ?.trim()
          .split(":")
          .map((v) => Number(v?.trim()));

        if (
          startHourRaw === undefined ||
          startMinuteRaw === undefined ||
          endHourRaw === undefined ||
          endMinuteRaw === undefined
        ) {
          console.error("Undefined minute");
          return undefined;
        }

        const [startHour, startMinute] = calcMeridian(
          startHourRaw,
          startMinuteRaw,
          startMeridian,
        );
        const [endHour, endMinute] = calcMeridian(
          endHourRaw,
          endMinuteRaw,
          endMeridian,
        );

        console.debug({
          endHour,
          endMinute,
          endMeridian,
          startHour,
          startMinute,
          startMeridian,
        });
        console.debug({ start: firstClassDate, end: course.end });

        // Split startTime and endtime into the hours and minutes to input into ICS "duration" field
        // let totalDuration = new Date(Math.abs(endTime - startTime)) //times are currently strings!

        const event: ics.EventAttributes = {
          start: [
            firstClassDate.getFullYear(),
            firstClassDate.getMonth() + 1, // getMonth is zero indexed, why??
            firstClassDate.getDate(),
            startHour,
            startMinute,
          ],
          end: [
            firstClassDate.getFullYear(),
            firstClassDate.getMonth() + 1,
            firstClassDate.getDate(),
            endHour,
            endMinute,
          ],
          title: course.name,
          location: location,
          recurrenceRule: repeatRule,
          busyStatus: "BUSY",
        };
        events.push(event);
      }
    }
  }
  const output = await ics.createEventsAsync(events);
  if (output.value) {
    return output.value;
  } else {
    console.error(output.error);
    return undefined;
  }
}
