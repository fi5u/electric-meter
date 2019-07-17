let currentDate = 'today'
let currentTimeframe = 'day'

/**
 * Set a new active date
 * @param {string} date
 */
function setDate(date) {
    let data

    if (typeof date === 'string') {
        if (date !== 'today' && date !== 'yesterday') {
            console.error(`Invalid date passed: ${date}`)
            return
        }

        currentDate = date

        const latestYearData = window.usageData[window.usageData.length - 1]
        const latestMonthData = latestYearData[latestYearData.length - 1]

        if (date === 'today') {
            data = latestMonthData[latestMonthData.length - 1]
        } else {
            // Is yesterday
            data = latestMonthData.length > 1
                // Yesterday in same month
                ? latestMonthData[latestMonthData.length - 2]
                // Yesterday in previous month
                : latestYearData.length > 1
                    // Yesterday in previous month in same year
                    ? latestYearData[latestYearData.length - 2][latestYearData[latestYearData.length - 2].length - 1]
                    // Yesterday in Dec in previous year
                    : window.usageData[window.usageData.length - 2][11][30]
        }
    }

    setChartDate(data, currentDate, currentTimeframe)
}

/**
 * Set the current active timeframe
 * @param {'day' | 'month'} timeframe
 */
function setTimeframe(timeframe) {
    currentTimeframe = timeframe
}

const connectedInterval = window.setInterval(() => {
    if (window.usageData) {
        window.clearInterval(connectedInterval)

        setDate('today')
    }
}, 1000)