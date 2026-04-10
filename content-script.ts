async function main() {
  const captionsNodeList = document.querySelectorAll("caption");
  const captions = Array.from(captionsNodeList);
  const enrolledCoursesCaption = captions.find((v) => v.textContent.includes("My Enrolled Courses"));
  if (!enrolledCoursesCaption) {
    alert("Could not find table.");
    return;
  }
  const rawTable = enrolledCoursesCaption.parentNode;
  const tBody = rawTable?.querySelectorAll("tbody").item(0);
  for (const row of tBody?.childNodes || []) {
    console.log(row.childNodes.item(1).textContent);
    console.log(row.childNodes.item(1).textContent);
  }
}

main().then(() => {});

