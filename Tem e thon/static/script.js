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