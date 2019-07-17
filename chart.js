const ctx = document.getElementById('chart')

/**
 * Set new date on chart
 * @param {Array} data Data to output
 * @param {string} date
 * @param {'day' | 'month'} timeframe
 */
function setChartDate(data, date, timeframe) {
    // Set active class on current date button
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

    // Set active class on current timeframe button
    const timeframeButtons = document.querySelectorAll('#timeframe-buttons > button')
    if (timeframeButtons) {
        timeframeButtons.forEach(button => {
            if (button.textContent.trim().toLowerCase() === timeframe) {
                button.classList.add('active')
            } else {
                button.classList.remove('active')
            }
        })
    }

    outputChart(data)
}

/**
 * Output a chart
 * @param {Array} data Data to output
 */
function outputChart(data) {
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
