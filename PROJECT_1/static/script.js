document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="number"]');
    let emissions = [];

    function updateEmissions() {
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emissions)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-emissions').textContent = data.total.toFixed(2);
        });
    }

    inputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const sourceId = this.dataset.sourceId;
            const value = parseFloat(this.value) || 0;
            
            const existingIndex = emissions.findIndex(e => e.sourceId === sourceId);
            if (existingIndex !== -1) {
                emissions[existingIndex].value = value;
            } else {
                emissions.push({ sourceId, value });
            }
            
            updateEmissions();
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll("input[data-source-id]");
    const totalEmissionsDisplay = document.getElementById("total-emissions");

    function calculateTotalEmissions() {
        let totalEmissions = 0;
        inputs.forEach(input => {
            let value = parseFloat(input.value) || 0;
            totalEmissions += value;
        });
        totalEmissionsDisplay.textContent = totalEmissions.toFixed(2);
    }

    inputs.forEach(input => {
        input.addEventListener("input", calculateTotalEmissions);
    });

    document.getElementById("submit-data").addEventListener("click", function () {
        const username = prompt("Enter your name:");
        if (!username) return alert("Username is required.");

        let emissions = {};
        inputs.forEach(input => {
            emissions[input.dataset.sourceId] = input.value || 0;
        });

        fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, emissions })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error: " + data.error);
            } else {
                alert("Data submitted successfully!");
            }
        });
    });
});
