let currentDate = 'today'
let currentTimeframe = 'day'
let hasSavedUsageData = false

/**
 * Set a new active date
 * @param {string} date
 */
function setDate(date) {
    const currentDataSet = window.usageData || window.savedUsageData
    let data

    if (typeof date === 'string') {
        if (date !== 'today' && date !== 'yesterday') {
            console.error(`Invalid date passed: ${date}`)
            return
        }

        currentDate = date

        const latestYearData = currentDataSet[currentDataSet.length - 1]
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
                    : currentDataSet[currentDataSet.length - 2][11][30]
        }
    }

    // Convert flashes to kW
    data = data.map(d => d / 1000)

    // Output chart with data
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
    if (window.savedUsageData && !hasSavedUsageData) {
        hasSavedUsageData = true
        // Note: this may not be today, need to fix
        setDate('today')
    }

    if (window.usageData) {
        window.clearInterval(connectedInterval)

        setDate('today')
    }
}, 1000)