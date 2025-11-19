const books = [
  { title: "مهارات البحث ومصادر المعلومات", author: "عبدالله الوابل", year: 2018 },
  { title: "البحث العلمي: أساسياته", author: "", year: 2017 },
  { title: "مصادر المعلومات الرقمية", author: "", year: 2015 },
  { title: "ألكشتات", author: "وليد الفايز" },
  { title: "الكورة", author: "عبدالله العبودي" },
  { title: "الامن السيبراني", author: "اخو بدر السحيباني" },
  { title: "مكنكه", author: "عبدالحكيم" },
  { title: "البثوث", author: "عبدالله العقلاء" },
  { title: "الزراعه", author: "يزيد الحربي" },
  { title: "ديوان شعر", author: "يزيد الفايز" },
  { title: "ماينكرافت", author: "علي السحيباني" },
  { title: "طبخ اللحم و اوفر واتش", author: "عادل الفايز" },
  { title: "توحد هولو نابت", author: "مازن الرميح" },
  { title: "الحمروني", author: "مهند العريني" },
  { title: "كورة بعد الاصابة", author: "سليمان القريشي" },
  { title: "الملك فيصل", author: "عمير السحيباني" },
  { title: "كيف تغرز", author: "البراء العريني" },
  { title: "كيف تكون ظالم", author: "ابو يزن" },
  { title: "كيف تفهم كل شي", author: "الملاح" },
  { title: "الشده علئ الطلاب", author: "دخيل الله" }
];

const TARGET_TITLE = "مهارات البحث ومصادر المعلومات";
const TARGET_AUTHOR = "عبدالله الوابل";
const TARGET_YEAR = 2018;

const tasksState = { 1: false, 2: false, 3: false };

const searchInput = document.getElementById("searchInput");
const yearFilter = document.getElementById("yearFilter");
const resultsList = document.getElementById("resultsList");
const successOverlay = document.getElementById("successOverlay");

function normalize(str){
  return (str || "").replace(/\s+/g, "").toLowerCase();
}

function buildYearOptions(){
  const years = Array.from(new Set(books.map(b => b.year).filter(Boolean))).sort();
  years.forEach(y => {
    const opt = document.createElement("option");
    opt.value = String(y);
    opt.textContent = String(y);
    yearFilter.appendChild(opt);
  });
}

function renderResults(){
  const q = searchInput.value.trim().toLowerCase();
  const yf = yearFilter.value.trim();
  resultsList.innerHTML = "";
  const filtered = books.filter(b => {
    const byText = q === "" || b.title.toLowerCase().includes(q) || (b.author || "").toLowerCase().includes(q);
    const byYear = yf === "" || String(b.year || "") === yf;
    return byText && byYear;
  });
  filtered.forEach(b => {
    const li = document.createElement("li");
    const left = document.createElement("div");
    const right = document.createElement("div");
    left.textContent = b.title;
    const author = b.author ? `تأليف: ${b.author}` : "";
    const year = b.year ? `سنة: ${b.year}` : "";
    right.className = "meta";
    right.textContent = [author, year].filter(Boolean).join(" — ");
    li.appendChild(left);
    li.appendChild(right);
    li.addEventListener("click", () => handleSelection(b));
    resultsList.appendChild(li);
  });
}

function handleSelection(item){
  if(item.title === TARGET_TITLE){
    tasksState[1] = true;
  }
  const a = normalize(item.author);
  const tAuth = normalize(TARGET_AUTHOR);
  if(a && a.includes(tAuth)){
    tasksState[2] = true;
  }
  if(item.title === TARGET_TITLE && item.year === TARGET_YEAR && yearFilter.value === String(TARGET_YEAR)){
    tasksState[3] = true;
  }
  updateTasksUI();
  maybeShowSuccess();
}

function updateTasksUI(){
  document.querySelectorAll("#tasksPanel li").forEach(li => {
    const id = Number(li.getAttribute("data-task"));
    const done = !!tasksState[id];
    li.classList.toggle("done", done);
    const s = li.querySelector(".status");
    s.textContent = done ? "✔️" : "☐";
  });
}

function maybeShowSuccess(){
  const allDone = tasksState[1] && tasksState[2] && tasksState[3];
  successOverlay.style.display = allDone ? "flex" : "none";
}

searchInput.addEventListener("input", renderResults);
yearFilter.addEventListener("change", renderResults);

buildYearOptions();
renderResults();
updateTasksUI();
