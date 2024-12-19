document.addEventListener("DOMContentLoaded", async (event) => {
    const tableBody = document.querySelector('table tbody');
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sort");
    let characterData = [];

    // Function to populate the table
    function populateTable(characters) {
        tableBody.innerHTML = ''; // Clear existing table rows

        const tableHeader = document.createElement('tr');
        const headerTitles = ['Character', 'Image', 'Win/Loss (Ratio)', 'Fastest Win (PB)'];
        headerTitles.forEach(title => {
            const th = document.createElement('th');
            th.textContent = title;
            th.style.fontSize = "32px"; // Adjust the text size
            tableHeader.appendChild(th);
        });
        tableBody.appendChild(tableHeader);

        Object.keys(characters).forEach(key => {
            const character = characters[key];
            const newRow = document.createElement('tr');

            // Create cell for character name
            const newCellChar = document.createElement('td');
            newCellChar.textContent = key;
            newCellChar.style.width = "25%"; // Adjust the width
            newRow.appendChild(newCellChar);

            // Create cell for character image
            const newCellImage = document.createElement('td');
            const img = document.createElement('img');
            img.src = "res/" + character["Picture"];
            img.alt = key;
            img.style.maxWidth = '100px'; // Limit image size
            newCellImage.style.width = "25%"; // Adjust the width
            newCellImage.appendChild(img);
            newRow.appendChild(newCellImage);

            // Create cell for win/loss data
            const newCellWinLoss = document.createElement('td');
            const winLossText = `${character["Wins"]} W - ${character["Losses"]} L`;
            if (character["Ratio"] !== "N/A") {
                newCellWinLoss.textContent = `${winLossText} (${character["Ratio"]}%)`;
            } else {
                newCellWinLoss.textContent = winLossText;
            }
            newCellWinLoss.style.width = "25%"; // Adjust the width
            newRow.appendChild(newCellWinLoss);

            // Create cell for PB data
            const newCellPB = document.createElement('td');
            newCellPB.textContent = character["PB_Time"];
            newCellPB.style.width = "25%"; // Adjust the width
            newRow.appendChild(newCellPB);

            tableBody.appendChild(newRow);
        });
    }

    // Function to filter characters based on search term
    function filterCharacters(searchTerm) {
        const filteredCharacters = Object.keys(characterData).filter(key => {
            return key.toLowerCase().includes(searchTerm.toLowerCase());
        });
        const filteredData = {};
        filteredCharacters.forEach(key => {
            filteredData[key] = characterData[key];
        });
        populateTable(filteredData);
    }

    // Function to sort characters based on selected option
    function sortCharacters(sortBy) {
        const sortedCharacters = Object.fromEntries(Object.entries(characterData).sort(([, a], [, b]) => {
            switch (sortBy) {
                case "wins":
                    if (parseInt(a["Wins"]) !== parseInt(b["Wins"])) {
                        return parseInt(b["Wins"]) - parseInt(a["Wins"]); // Sort by wins descending
                    } else {
                        return parseInt(a["Losses"]) - parseInt(b["Losses"]); // Sort by losses ascending
                    }
                case "ratio":
                    const ratioA = a["Ratio"] === "N/A" ? 0 : parseFloat(a["Ratio"]);
                    const ratioB = b["Ratio"] === "N/A" ? 0 : parseFloat(b["Ratio"]);
                    return ratioB - ratioA; // Sort by ratio descending
                case "pb":
                    const pbA = a["PB_Time"] === "N/A" ? 1000 : parseFloat(a["PB_Time"]);
                    const pbB = b["PB_Time"] === "N/A" ? 1000 : parseFloat(b["PB_Time"]);
                    return pbA - pbB; // Sort by PB ascending
                case "loss":
                    if (parseInt(a["Losses"]) !== parseInt(b["Losses"])) {
                        return parseInt(b["Losses"]) - parseInt(a["Losses"]); // Sort by losses descending
                    } else {
                        return parseInt(a["Wins"]) - parseInt(b["Wins"]); // Sort by wins ascending
                    }
                default:
                    return 0;
            }
        }));
        populateTable(sortedCharacters);
    }

    // Fetch character data
    try {
        const response = await fetch("https://raw.githubusercontent.com/zombiieh/MugenKumiteStats/main/CharList.json");
        characterData = await response.json();
        console.log(characterData);

        // Sort by "ratio" after fetching data and populate the table
        sortCharacters("ratio");
    } catch (error) {
        console.error("Error fetching character data:", error);
    }

    // Search function
    searchInput.addEventListener("keyup", function () {
        const searchTerm = this.value.trim();
        filterCharacters(searchTerm);
    });

    // Sort function
    sortSelect.addEventListener("change", function () {
        const sortBy = this.value;
        sortCharacters(sortBy);
    });
});
