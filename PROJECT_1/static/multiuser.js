document.addEventListener("DOMContentLoaded", function () {
    const userCountInput = document.getElementById("user-count");
    const errorMessage = document.getElementById("error-message");
    const userInputsContainer = document.getElementById("user-inputs");
    const form = document.getElementById("multiuser-form");
    const totalEmissionsDisplay = document.getElementById("total-emissions");
    const resultContainer = document.getElementById("result-container");

    function generateUserInputs() {
        let userCount = parseInt(userCountInput.value);

        if (userCount > 10) {
            errorMessage.classList.remove("hidden");
            return;
        }
        errorMessage.classList.add("hidden");
        userInputsContainer.innerHTML = "";
        form.classList.remove("hidden");

        for (let i = 1; i <= userCount; i++) {
            let userDiv = document.createElement("div");
            userDiv.classList.add("bg-white/10", "p-4", "rounded-lg", "mb-4", "border", "border-white/20");

            userDiv.innerHTML = `
                <h3 class="text-lg font-semibold text-white mb-2">User ${i}</h3>
                ${generateEmissionInputs(i)}
            `;
            userInputsContainer.appendChild(userDiv);
        }
    }

    function generateEmissionInputs(userIndex) {
        let emissionSources = [
            { id: "electricity", name: "Electricity", unit: "kWh" },
            { id: "car", name: "Car Travel", unit: "km" },
            { id: "flight", name: "Air Travel", unit: "km" },
            { id: "meat", name: "Meat Consumption", unit: "kg" },
            { id: "waste", name: "Waste", unit: "kg" },
        ];

        return emissionSources
            .map(
                (source) => `
                    <div class="mb-2">
                        <label class="text-white text-sm">${source.name} (${source.unit}):</label>
                        <input type="number" data-source-id="${source.id}" data-user-id="${userIndex}"
                            class="w-full px-3 py-2 mt-1 bg-white/10 text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-emerald-500">
                    </div>
                `
            )
            .join("");
    }

    function calculateMultiUser() {
        let inputs = document.querySelectorAll("[data-source-id]");
        let emissionsData = [];

        inputs.forEach((input) => {
            emissionsData.push({
                sourceId: input.getAttribute("data-source-id"),
                value: input.value || 0,
            });
        });

        fetch("/multi-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emissionsData),
        })
            .then((response) => response.json())
            .then((data) => {
                totalEmissionsDisplay.innerText = data.total;
                resultContainer.classList.remove("hidden");
            })
            .catch((error) => console.error("Error:", error));
    }

    document.querySelector("button[onclick='generateUserInputs()']").addEventListener("click", generateUserInputs);
    document.querySelector("button[onclick='calculateMultiUser()']").addEventListener("click", calculateMultiUser);
});
