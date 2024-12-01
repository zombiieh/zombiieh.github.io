document.addEventListener("DOMContentLoaded", async (event) => {
    const tableBody = document.querySelector('table tbody');
    const searchInput = document.getElementById("searchInput");
    let userData = [];

    // Function to populate the table
    async function populateTable(users) {
        tableBody.innerHTML = ''; // Clear existing table rows

        // Create table headers
        const tableHeader = document.createElement('tr');
        const headerTitles = ['Nickname', 'Characters'];
        headerTitles.forEach(title => {
            const th = document.createElement('th');
            th.textContent = title;
            tableHeader.appendChild(th);
        });
        tableBody.appendChild(tableHeader);

        for (const key of Object.keys(users)) {
            const user = users[key];
            const newRow = document.createElement('tr');

            // Create cell for Nickname
            const newCellNickname = document.createElement('td');
            newCellNickname.textContent = user["Nickname"] || "Unknown";
            newRow.appendChild(newCellNickname);

            // Create cell for Characters
            const newCellCharacters = document.createElement('td');
            const characters = user["Characters"];

            if (Array.isArray(characters) && characters.length > 0) {
                characters.forEach(characterName => {
                    const charDiv = document.createElement('div');
                    charDiv.style.display = 'flex';
                    charDiv.style.flexDirection = 'column';
                    charDiv.style.alignItems = 'center';
                    charDiv.style.marginBottom = '10px';

                    // Add character image
                    const img = document.createElement('img');
                    img.src = "../res/" + characterName + ".png";
                    img.alt = characterName || "Character Image";
                    img.style.maxWidth = '100px'; // Larger image size
                    img.style.marginBottom = '5px';
                    charDiv.appendChild(img);

                    // Add character name below the image
                    const charName = document.createElement('span');
                    charName.textContent = characterName;
                    charName.style.textAlign = 'center';
                    charDiv.appendChild(charName);

                    newCellCharacters.appendChild(charDiv);
                });
            } else {
                newCellCharacters.textContent = 'No characters listed';
            }

            newRow.appendChild(newCellCharacters);
            tableBody.appendChild(newRow);
        }
    }

    // Function to filter users based on search term
    function filterUsers(searchTerm) {
        const filteredUsers = Object.keys(userData).filter(key => {
            const user = userData[key];
            const nickname = user["Nickname"] || "";
            return nickname.toLowerCase().includes(searchTerm.toLowerCase());
        });
        const filteredData = {};
        filteredUsers.forEach(key => {
            filteredData[key] = userData[key];
        });
        populateTable(filteredData);
    }

    // Fetch user data
    try {
        const response = await fetch("https://raw.githubusercontent.com/zombiieh/MugenKumiteStats/main/TEST.json");
        userData = await response.json();
        populateTable(userData);
    } catch (error) {
        console.error("Error fetching user data:", error);
    }

    // Search function
    searchInput.addEventListener("keyup", function () {
        const searchTerm = this.value.trim();
        filterUsers(searchTerm);
    });
});
