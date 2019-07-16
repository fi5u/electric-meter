const ctx = document.getElementById('chart')

let data = []

function setDate(date) {
    // Set active class on button
    const meterButtons = document.querySelectorAll('#meter-buttons > button')
    if (meterButtons) {
        meterButtons.forEach(button => {
            if (button.textContent.trim().toLowerCase() === date) {
                button.classList.add('active')
            } else {
                button.classList.remove('active')
            }
        })
    }

    // Set the chart data and output chart
    if (date === 'today' || date === 'yesterday') {
        data = window.usageData[date]

        outputChart()
    }
}

function outputChart() {
    /*
    const currentYearData = data[data.length - 1]
    const currentMonthData = currentYearData[currentYearData.length - 1]
    const currentDateData = currentMonthData[currentMonthData.length - 1]
    const currentHourData = currentDateData[currentDateData.length - 1]
    */

    new Chart(ctx, {
        data: {
            datasets: [{
                backgroundColor: '#dd2244',
                data: data
            }],
            labels: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        min: '0:00'
                    }
                }]
            }
        },
        type: 'line',
    });
}

const connectedInterval = window.setInterval(() => {
    if (window.dataLoaded) {
        window.clearInterval(connectedInterval)

        setDate('today')
    }
}, 1000)