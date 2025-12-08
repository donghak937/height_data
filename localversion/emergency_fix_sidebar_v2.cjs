const fs = require('fs');
const filePath = 'c:\\Users\\dongh\\height_data\\localversion\\local_height_compare.html';

try {
    let content = fs.readFileSync(filePath, 'utf8');

    const startMarker = "function updateColor(id, color) {";
    const endMarker = "// Render Selected List";

    const idx1 = content.indexOf(startMarker);
    const idx2 = content.indexOf(endMarker, idx1);

    if (idx1 !== -1 && idx2 !== -1) {
        // We need to find where to insert.
        // We assume updateColor ends before endMarker.
        // But currently it seems the closing brace is missing or we want to insert after saveData();

        const saveDataMarker = "saveData();";
        const idxSave = content.indexOf(saveDataMarker, idx1);

        if (idxSave !== -1 && idxSave < idx2) {
            const insertionPoint = idxSave + saveDataMarker.length;

            const missingCode = `
        }

        function renderSidebar() {
            const searchText = document.getElementById('searchInput') ? document.getElementById('searchInput').value.trim() : '';
            const genderFilter = document.getElementById('filterGender').value;
            const schoolFilter = document.getElementById('filterSchool').value;

            // Populate School Filter
            const schools = [...new Set(state.characters.map(c => c.school || '기타'))].sort();
            const currentSchoolVal = els.filterSchool.value;
            els.filterSchool.innerHTML = '<option value="all">전체 소속</option>' +
                schools.map(s => \`<option value="\${s}">\${s}</option>\`).join('');
            els.filterSchool.value = currentSchoolVal;

            // Filter
            const filtered = state.characters.filter(c => {
                const matchGender = genderFilter === 'all' || c.gender === genderFilter;
                const matchSchool = schoolFilter === 'all' || (c.school || '기타') === schoolFilter;
                const matchSearch = !searchText || c.name.includes(searchText) || getChosung(c.name).includes(searchText);
                return matchGender && matchSchool && matchSearch;
            });

            // Update Counts
            els.totalCount.innerText = filtered.length;
            els.selectedCount.innerText = state.selectedIds.length;
            els.selectedSection.style.display = state.selectedIds.length > 0 ? 'block' : 'none';

            `;

            const newContent = content.slice(0, insertionPoint) + missingCode + content.slice(idx2);
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Successfully reconstructed renderSidebar (v2)');

        } else {
            console.error('saveData() not found or out of place');
        }
    } else {
        console.error('Markers not found');
        console.log('idx1:', idx1);
        console.log('idx2:', idx2);
    }

} catch (e) {
    console.error(e);
}
