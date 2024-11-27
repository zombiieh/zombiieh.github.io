document.addEventListener("DOMContentLoaded", async (event) => {
    const tableBody = document.querySelector('table tbody');
    const searchInput = document.getElementById("searchInput");
    let stageData = [];

    // Function to populate the table
    async function populateTable(stages) {
        tableBody.innerHTML = ''; // Clear existing table rows

        const tableHeader = document.createElement('tr');
        const headerTitles = ['Stage', 'Image'];
        headerTitles.forEach(title => {
            const th = document.createElement('th');
            th.textContent = title;
            tableHeader.appendChild(th);
        });
        tableBody.appendChild(tableHeader);

        for (const key of Object.keys(stages)) {
            const stage = stages[key];
            const newRow = document.createElement('tr');

            // Create cell for stage name
            const newCellChar = document.createElement('td');
            newCellChar.textContent = key;
            newRow.appendChild(newCellChar);

            // Create cell for stage image
            const newCellImage = document.createElement('td');
            const imgSrc = "../res/stages/" + stage["Picture"];

            try {
                const response = await fetch(imgSrc, { method: 'HEAD' });
                if (response.ok) {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = key;
                    img.style.maxWidth = '400px'; // Limit image size
                    newCellImage.appendChild(img);
                } else {
                    newCellImage.textContent = 'Image not found';
                }
            } catch (error) {
                // console.error("Error checking image existence:", error);
                newCellImage.textContent = 'Image not found';
            }

            newRow.appendChild(newCellImage);
            tableBody.appendChild(newRow);
        }
    }

    // Function to filter stages based on search term
    function filterStages(searchTerm) {
        const filteredStages = Object.keys(stageData).filter(key => {
            return key.toLowerCase().includes(searchTerm.toLowerCase());
        });
        const filteredData = {};
        filteredStages.forEach(key => {
            filteredData[key] = stageData[key];
        });
        populateTable(filteredData);
    }

    // Fetch stage data
    try {
        const response = await fetch("https://raw.githubusercontent.com/zombiieh/MugenKumiteStats/main/TEST.json");
        stageData = await response.json();
        populateTable(stageData);
    } catch (error) {
        console.error("Error fetching stage data:", error);
    }

    // Search function
    searchInput.addEventListener("keyup", function () {
        const searchTerm = this.value.trim();
        filterStages(searchTerm);
    });
});
