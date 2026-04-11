import type { CalTransfer } from "./transfer";
import insultsUntyped from "./insults.json";
import "./createics";
import { writeCalendarFile } from "./createics";

interface DeptInsults {
  [k: string]: string;
  default: string;
}

interface InsultData {
  [k: string]: DeptInsults;
}

const insults: InsultData = insultsUntyped;

function saveString(data: string) {
  const blob = new Blob([data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "courses.ics";
  a.click();

  URL.revokeObjectURL(url);
}

function parseCarletonDate(date: string): Date | undefined {
  const [month, day, year] = date.split("/").map((v) => new Number(v?.trim()));
  if (!month || !day || !year) {
    return undefined;
  }
  return new Date(`${year}-${month}-${day}`);
}

function getInsult(
  department: string | undefined,
  course: string | undefined,
): string | undefined {
  if (!department) {
    return undefined;
  }
  const deptInsults = insults[department];
  if (!deptInsults) {
    return undefined;
  }
  let deptInsult = deptInsults.default;
  if (!course) {
    return deptInsult;
  } else {
    let classInsult = deptInsults[course];
    if (classInsult) {
      return classInsult;
    } else {
      return deptInsult;
    }
  }
}

async function main() {
  const captionsNodeList = document.querySelectorAll("caption");
  const captions = Array.from(captionsNodeList);
  const enrolledCoursesCaption = captions.find((v) =>
    v.textContent.includes("My Enrolled Courses"),
  );
  if (!enrolledCoursesCaption) {
    alert("Could not find table.");
    return;
  }
  const rawTable = enrolledCoursesCaption.parentNode;
  const tBody = rawTable?.querySelectorAll("tbody").item(0);
  let classes: CalTransfer[] = [];

  for (const row of tBody?.childNodes || []) {
    const timeElementList = (
      row.childNodes.item(9) as HTMLElement
    ).querySelectorAll("li");
    const timeSet =
      Array.from(timeElementList)
        .map((v) => v.textContent)
        .filter((v) => v.length != 0 && /\s/g.test(v)) ?? [];

    const startDate = parseCarletonDate(
      row.childNodes.item(11).textContent || "unknown",
    );
    const endDate = parseCarletonDate(
      row.childNodes.item(12).textContent || "unknown",
    );
    endDate?.setDate(endDate.getDate() - 5); // Number of days in reading days

    if (!startDate || !endDate) {
      alert("Invalid dates");
      return;
    }

    classes.push({
      name: row.childNodes.item(1).textContent || "unknown",
      times: timeSet,
      start: startDate,
      end: endDate,
    });
  }

  const splitCourseInfo =
    classes[Math.floor(Math.random() * classes.length)]?.name?.split(" ");
  if (splitCourseInfo) {
    const [insultDept, insultCourse] = splitCourseInfo;
    const insult = getInsult(insultDept, insultCourse);
    if (insult) {
      alert(insult);
    }
  }

  const calFile = await writeCalendarFile(classes);
  if (!calFile) {
    alert("Failed to parse dates");
    return;
  }

  saveString(calFile);
}

main().then(() => {});
