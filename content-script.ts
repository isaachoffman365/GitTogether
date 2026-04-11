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
    classes.push({
      name: row.childNodes.item(1).textContent || "unknown",
      times: timeSet
    });
  }
  saveString(JSON.stringify(classes));

}

main();

