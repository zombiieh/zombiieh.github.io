document.addEventListener("DOMContentLoaded", async (event) => {
    const tableBody = document.querySelector('table tbody');
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sort");
    let characterData = [];

// Function to calculate font color based on ratio
function getFontColor(ratio) {
    // Ensure ratio is between 0 and 100
    ratio = Math.max(0, Math.min(100, ratio));

    // Interpolate between yellow and red
    const red = 255; // Red stays constant
    const green = Math.round(255 * (1 - ratio / 100)); // Green decreases with ratio
    const blue = 0; // Blue stays constant

    return `rgb(${red}, ${green}, ${blue})`;
}

function populateTable(characters) {
    tableBody.innerHTML = ''; // Clear existing table rows

    const tableHeader = document.createElement('tr');
    const headerTitles = ['Character', 'Win/Loss (Ratio)', 'Fastest Win (PB)'];
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

        // Create a combined cell for character name and image
        const newCellCharImage = document.createElement('td');
        newCellCharImage.style.display = "flex";
        newCellCharImage.style.alignItems = "center";
        newCellCharImage.style.justifyContent = "center"; // Center the content horizontally
        newCellCharImage.style.gap = "10px"; // Add spacing between the image and text

        const img = document.createElement('img');
        img.src = "res/" + character["Picture"];
        img.alt = key;
        img.style.maxWidth = '100px'; // Adjust the size of the image
        newCellCharImage.appendChild(img);

        // Add character name
        const charName = document.createElement('span');
        charName.textContent = key;

        // Make the character name bold
        charName.style.fontWeight = "bold";

        // Check if the character name includes "(Showcase only)"
        if (key.includes("(Showcase only)")) {
            charName.style.color = "blue"; // Set color to blue
        } else {
            // Apply ratio-based coloring for other characters
            const ratio = character["Ratio"] === "N/A" ? 0 : parseFloat(character["Ratio"]);
            const colorValue = Math.max(0, Math.min(255, Math.floor((ratio / 100) * 255)));
            charName.style.color = `rgb(255, ${255 - colorValue}, 0)`; // Color transition from red to yellow
        }

        newCellCharImage.appendChild(charName);
        newRow.appendChild(newCellCharImage);

        // Create cell for win/loss data
        const newCellWinLoss = document.createElement('td');
        const winLossText = `${character["Wins"]} W - ${character["Losses"]} L`;
        if (character["Ratio"] !== "N/A") {
            newCellWinLoss.textContent = `${winLossText} (${character["Ratio"]}%)`;
            newCellWinLoss.style.color = getFontColor(parseFloat(character["Ratio"])); // Set font color
        } else {
            newCellWinLoss.textContent = winLossText;
        }
        newCellWinLoss.style.width = "25%"; // Adjust the width
        newRow.appendChild(newCellWinLoss);

        // Create cell for PB data
        const newCellPB = document.createElement('td');
        newCellPB.textContent = character["PB_Time"];
        newCellPB.style.width = "25%"; // Adjust the width
        //newCellPB.style.color = `rgb(0,0,0)`;
        
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

    function sortCharacters(sortBy) {
        const sortedCharacters = Object.fromEntries(Object.entries(characterData).sort(([, a], [, b]) => {
            switch (sortBy) {
                case "wins":
                    if (parseInt(a["Wins"]) !== parseInt(b["Wins"])) {
                        return parseInt(b["Wins"]) - parseInt(a["Wins"]); // Sort by wins descending
                    } else {
                        return parseFloat(b["Ratio"] || 0) - parseFloat(a["Ratio"] || 0); // Sort by ratio descending
                    }
                case "ratio":
                    const ratioA = a["Ratio"] === "N/A" ? 0 : parseFloat(a["Ratio"]);
                    const ratioB = b["Ratio"] === "N/A" ? 0 : parseFloat(b["Ratio"]);
                    if (ratioA !== ratioB) {
                        return ratioB - ratioA; // Sort by ratio descending
                    } else {
                        return parseInt(b["Wins"]) - parseInt(a["Wins"]); // Sort by wins descending
                    }
                case "pb":
                    const pbA = a["PB_Time"] === "N/A" ? 1000 : parseFloat(a["PB_Time"]);
                    const pbB = b["PB_Time"] === "N/A" ? 1000 : parseFloat(b["PB_Time"]);
                    return pbA - pbB; // Sort by PB ascending
                case "loss":
                    if (parseInt(a["Losses"]) !== parseInt(b["Losses"])) {
                        return parseInt(b["Losses"]) - parseInt(a["Losses"]); // Sort by losses descending
                    } else {
                        return parseFloat(b["Ratio"] || 0) - parseFloat(a["Ratio"] || 0); // Sort by ratio descending
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
