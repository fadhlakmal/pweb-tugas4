document.getElementById("fetchWeatherData").addEventListener("click", () => {
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    const weatherChartContainer = document.getElementById("weatherChartContainer");
    weatherChartContainer.innerHTML = '<canvas id="weatherChart" width="300" height="100"></canvas>';

    const apiUrl = `http://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=astro&output=xml`;

    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            console.log(data);
            
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");

            const dataseries = xmlDoc.querySelector("product dataseries");
            const dataEntries = dataseries.querySelectorAll("data");

            const timepoints = [];
            const temperatures = [];
            const cloudCovers = [];

            dataEntries.forEach(dataEntry => {
                const timepoint = dataEntry.getAttribute("timepoint");
                const temperature = parseFloat(dataEntry.querySelector("temp2m").textContent);
                const cloudCover = parseFloat(dataEntry.querySelector("cloudcover").textContent);

                timepoints.push(timepoint);
                temperatures.push(temperature);
                cloudCovers.push(cloudCover);
            });

            const ctx = document.getElementById("weatherChart").getContext("2d");

            new Chart(ctx, {
                type: "line",
                data: {
                    labels: timepoints,
                    datasets: [
                        {
                            label: "Temperature (°C)",
                            data: temperatures,
                            borderColor: "rgba(255, 99, 132, 1)",
                            backgroundColor: "rgba(255, 99, 132, 0.2)",
                        },
                        {
                            label: "Cloud Cover",
                            data: cloudCovers,
                            borderColor: "rgba(54, 162, 235, 1)",
                            backgroundColor: "rgba(54, 162, 235, 0.2)",
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        })
        .catch(error => {
            console.error(error);
            weatherChartContainer.innerHTML = '<p>Invalid langtitude and longtitude.</p>';
        });
});