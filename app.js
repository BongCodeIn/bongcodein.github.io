// ============================================================
// 1. MANUAL PDF REGISTRY (Add your new PDFs here)
// ============================================================
const pdfData = [
  // Add your PDF objects here...
];

// ============================================================
// 2. FUZZY SEARCH SETUP (Fuse.js for smart search)
// ============================================================
const fuseOptions = {
  includeScore: true,
  threshold: 0.4, // Lower number = stricter matching; 0.4 handles typos nicely
  keys: ["title", "classLevel", "subject", "type", "tags"]
};

let fuse = new Fuse(pdfData, fuseOptions);

// Dynamic DOM Elements
const searchInput = document.getElementById("searchInput");
const classFilter = document.getElementById("classFilter");
const subjectFilter = document.getElementById("subjectFilter");
const typeFilter = document.getElementById("typeFilter");
const resetBtn = document.getElementById("resetFilters");
const container = document.getElementById("pdfContainer");
const noResults = document.getElementById("noResults");

// ============================================================
// 3. RENDER FUNCTION WITH AUTOMATIC GROUPING
// ============================================================
function renderPDFs() {
  const query = searchInput.value.trim();
  const selectedClass = classFilter.value;
  const selectedSubject = subjectFilter.value;
  const selectedType = typeFilter.value;

  // Step A: Search / Filter items
  let results = pdfData;

  if (query.length > 0) {
    results = fuse.search(query).map(result => result.item);
  }

  // Apply Dropdown Filters
  results = results.filter(item => {
    const matchClass = selectedClass === "ALL" || item.classLevel === selectedClass;
    const matchSubject = selectedSubject === "ALL" || item.subject === selectedSubject;
    const matchType = selectedType === "ALL" || item.type === selectedType;
    return matchClass && matchSubject && matchType;
  });

  // Step B: Handle empty search states
  if (results.length === 0) {
    container.innerHTML = "";
    noResults.classList.remove("hidden");
    return;
  }
  noResults.classList.add("hidden");

  // Step C: Auto-group PDFs by Class & Subject
  const grouped = {};
  results.forEach(pdf => {
    const groupKey = `${pdf.classLevel} — ${pdf.subject}`;
    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(pdf);
  });

  // Step D: Build HTML dynamically
  let htmlContent = "";

  for (const groupName in grouped) {
    htmlContent += `
      <section class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-800">${groupName}</h2>
          <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
            ${grouped[groupName].length} ${grouped[groupName].length === 1 ? 'file' : 'files'}
          </span>
        </div>
        
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          ${grouped[groupName].map(pdf => createCardHTML(pdf)).join('')}
        </div>
      </section>
    `;
  }

  container.innerHTML = htmlContent;
}

// Card HTML Generator
function createCardHTML(pdf) {
  return `
    <div class="border border-slate-200 hover:border-indigo-400 p-4 rounded-lg flex flex-col justify-between hover:shadow-md transition bg-slate-50/50">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded">
            ${pdf.type}
          </span>
          <span class="text-xs text-slate-400 font-medium">${pdf.classLevel}</span>
        </div>
        <h3 class="font-semibold text-slate-800 text-base mb-1 line-clamp-2">${pdf.title}</h3>
      </div>

      <div class="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/80">
        <a href="${pdf.filename}" target="_blank" rel="noopener noreferrer" 
           class="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-3 rounded-md transition">
           👁️ View PDF
        </a>
        <a href="${pdf.filename}" download 
           class="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium py-2 px-3 rounded-md transition" title="Download File">
           📥 Download
        </a>
      </div>
    </div>
  `;
}

// Event Listeners for Filters
searchInput.addEventListener("input", renderPDFs);
classFilter.addEventListener("change", renderPDFs);
subjectFilter.addEventListener("change", renderPDFs);
typeFilter.addEventListener("change", renderPDFs);

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  classFilter.value = "ALL";
  subjectFilter.value = "ALL";
  typeFilter.value = "ALL";
  renderPDFs();
});

// Initial Render on Page Load
renderPDFs();