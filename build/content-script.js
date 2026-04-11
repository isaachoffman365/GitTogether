// insults.json
var insults_default = {
  CS: {
    default: "Ohh, CS. What a nerd you are."
  },
  LING: {
    default: "Did you hear linguistics was the easiest major or something?"
  },
  GERM: {
    default: "oh ja loek att mich ich kan deutsch"
  },
  HIST: {
    default: "They say to study history or find yourself repeating it but all that it prepares you for is 40 years of teaching it."
  }
};

// content-script.ts
var insults = insults_default;
function saveString(data) {
  const blob = new Blob([data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "schedule.json";
  a.click();
  URL.revokeObjectURL(url);
}
function parseCarletonDate(date) {
  const [month, day, year] = date.split("/").map((v) => new Number(v?.trim()));
  if (!month || !day || !year) {
    return;
  }
  return new Date(`${year}-${month}-${day}`);
}
function getInsult(department, course) {
  if (!department) {
    return;
  }
  const deptInsults = insults[department];
  if (!deptInsults) {
    return;
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
function main() {
  const captionsNodeList = document.querySelectorAll("caption");
  const captions = Array.from(captionsNodeList);
  const enrolledCoursesCaption = captions.find((v) => v.textContent.includes("My Enrolled Courses"));
  if (!enrolledCoursesCaption) {
    alert("Could not find table.");
    return;
  }
  const rawTable = enrolledCoursesCaption.parentNode;
  const tBody = rawTable?.querySelectorAll("tbody").item(0);
  let classes = [];
  for (const row of tBody?.childNodes || []) {
    const timeElementList = row.childNodes.item(9).querySelectorAll("li");
    const timeSet = Array.from(timeElementList).map((v) => v.textContent).filter((v) => v.length != 0 && /\s/g.test(v)) ?? [];
    const startDate = parseCarletonDate(row.childNodes.item(11).textContent || "unknown");
    const endDate = parseCarletonDate(row.childNodes.item(12).textContent || "unknown");
    if (!startDate || !endDate) {
      alert("Invalid dates");
      return;
    }
    classes.push({
      name: row.childNodes.item(1).textContent || "unknown",
      times: timeSet,
      start: startDate,
      end: endDate
    });
  }
  const splitCourseInfo = classes[Math.floor(Math.random() * classes.length)]?.name?.split(" ");
  if (splitCourseInfo) {
    const [insultDept, insultCourse] = splitCourseInfo;
    const insult = getInsult(insultDept, insultCourse);
    if (insult) {
      alert(insult);
    }
  }
  saveString(JSON.stringify(classes));
}
main();
