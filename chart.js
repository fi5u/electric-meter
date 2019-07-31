const ctx = document.getElementById('chart')

const dayAxis = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']

/**
 * Set new date on chart
 * @param {Array} data Data to output
 * @param {'day' | 'month'} timeframe
 */
function setChartDate(data, timeframe) {
    outputChart(data, timeframe)
    setTotal(data, timeframe)
}

/**
 * Output a chart
 * @param {Array} data Data to output
 * @param {'day' | 'month'} timeframe Current timeframe
 */
function outputChart(data, timeframe) {
    new Chart(ctx, {
        data: {
            datasets: [{
                backgroundColor: '#39f',
                data: data,
                label: 'Energy usage (kW)'
            }],
            labels: timeframe === 'day' ? dayAxis : data.map((d, i) => i + 1)
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

/**
 * Set the total used element
 * @param {Array} data Array of numbers to calculate total
 * @param {'day' | 'month'} timeframe
 */
function setTotal(data, timeframe) {
    const totalElement = document.getElementById('total-kw')
    if (totalElement) {
        const total = data.reduce((runningTotal, current) => {
            return runningTotal + current
        }, 0)

        const decimalPlaces = 2

        totalElement.textContent = `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} total: ${Number(Math.round(total + 'e' + decimalPlaces) + 'e-' + decimalPlaces)} kW`
    }
}