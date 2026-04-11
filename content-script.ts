import type { CalTransfer } from "./transfer";

function saveString(data: string) {
  const blob = new Blob([data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "schedule.json";
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
  let classes: CalTransfer[] = [];
  
  for (const row of tBody?.childNodes || []) {
    const timeElementList = (row.childNodes.item(9) as HTMLElement).querySelectorAll("li");
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
  saveString(JSON.stringify(classes));

}

main();

