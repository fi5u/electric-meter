let currentTimeframe = 'day'
let hasSavedUsageData = false

/**
 * Return the name of month from number (1 indexed)
 * @param {number} month Month to fetch
 */
function getMonth(month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months[month - 1]
}

/**
 * Convert array of flash count to array of KW
 * @param {Array<int>} flashData Array of flash counts
 */
function convertFlashesToKW(flashData) {
    return flashData.map(d => d / 1000)
}

/**
 * Get the currently-selected part of the date
 * @param {'year' | 'month' | 'date'} key Part of the date
 */
function getCurrentDatePart(key) {
    const element = document.querySelector(`input[name=input-${key}]:checked`)

    if (element) {
        return parseInt(element.value)
    }
}

/**
 * Get data for specific date, returns latest if no date supplied
 * @param {number} date.year
 * @param {number} date.month
 * @param {number} date.date
 */
function getData(date) {
    const data = window.usageData || window.savedUsageData

    const iYear = date ? parseInt(date.year.toString().split('20')[1]) : data.length - 1
    const iMonth = date ? date.month - 1 : data[iYear].length - 1
    const iDate = date ? date.date : data[iYear][iMonth].length - 1

    if (data[iYear] && data[iYear][iMonth] && data[iYear][iMonth][iDate]) {
        return data[iYear][iMonth][iDate]
    }

    console.log('Date not found in data')
}

/**
 * Generate and output elements
 * @param {number} i Incrementor
 * @param {string} key Date key
 * @param {object} container Container element
 * @param {boolean} isChecked Whether current element is checked
 */
function generateElements(i, key, container, isChecked) {
    const radio = document.createElement('input')
    radio.type = 'radio'

    const value = key === 'year'
        ? '20' + i.toString()
        : key === 'month'
            ? i + 1
            : i

    radio.id = `${key}-${value}`
    radio.value = value
    radio.name = `input-${key}`

    if (isChecked) {
        radio.checked = true
    }

    if (key === 'date') {
        // No need to re-output meter buttons when just date changes
        radio.addEventListener('change', () => setDate({
            year: getCurrentDatePart('year'),
            month: getCurrentDatePart('month'),
            date: i,
        }))
    } else {
        radio.addEventListener('change', () => setButtonsAndData({
            year: key === 'year' ? 2000 + i : getCurrentDatePart('year'),
            month: key === 'month' ? i + 1 : getCurrentDatePart('month'),
            date: getCurrentDatePart('date')
        }))
    }

    const label = document.createElement('label')
    label.htmlFor = `${key}-${value}`
    label.textContent = key === 'month' ? getMonth(value) : value

    container.appendChild(radio)
    container.appendChild(label)
}

/**
 * Output meter buttons
 * @param {Array} data Actual usage data
 * @param {number} date.year
 * @param {number} date.month
 * @param {number} date.date
 */
function outputMeterButtons(data, date) {
    const yearContainer = document.getElementById('meter-buttons-year')
    const monthContainer = document.getElementById('meter-buttons-month')
    const dateContainer = document.getElementById('meter-buttons-date')

    // Empty all elements
    while (yearContainer.firstChild) {
        yearContainer.removeChild(yearContainer.firstChild);
    }

    while (monthContainer.firstChild) {
        monthContainer.removeChild(monthContainer.firstChild);
    }

    while (dateContainer.firstChild) {
        dateContainer.removeChild(dateContainer.firstChild);
    }

    // Always output all years
    for (let iYear = 0; iYear < data.length; iYear++) {
        const year = data[iYear]

        if (!year) {
            continue
        }

        generateElements(iYear, 'year', yearContainer, (date && date.year === 2000 + iYear) || iYear === data.length - 1)

        if ((date && date.year === iYear) || iYear === data.length - 1) {
            // Output the months of the selected year

            for (let iMonth = 0; iMonth < year.length; iMonth++) {
                const month = year[iMonth]

                if (!month) {
                    continue
                }

                generateElements(iMonth, 'month', monthContainer, (date && date.month === iMonth + 1) || iMonth === year.length - 1)

                if ((date && date.month === iMonth) || iMonth === year.length - 1) {
                    // Output the dates

                    for (let iDate = 0; iDate < month.length; iDate++) {
                        const date = month[iDate]

                        if (!date) {
                            continue
                        }

                        generateElements(iDate, 'date', dateContainer, (date && date.date === iDate + 1) || iDate === month.length - 1)
                    }
                }
            }
        }
    }
}

function setButtonsAndData(date) {
    outputMeterButtons(window.usageData || window.savedUsageData, date)
    setDate(date)
}

/**
 * Set a new active date
 * @param {number} [date.year]
 * @param {number} [date.month]
 * @param {number} [date.date]
 */
function setDate(date) {
    const data = getData(date)
    const kWData = convertFlashesToKW(data)

    // Output chart with data
    setChartDate(kWData, currentTimeframe)
}

/**
 * Set the current active timeframe
 * @param {'day' | 'month'} timeframe
 */
function setTimeframe(timeframe) {
    currentTimeframe = timeframe
}

/**
 * Update the DOM with the current energy usage
 */
function setCurrentUsage() {
    const element = document.getElementById('current-usage')
    element.textContent = `Current energy usage: ${window.currentkWh} kWh`
}

// Interval to check if data has loaded
const connectedInterval = window.setInterval(() => {
    if (window.savedUsageData && !hasSavedUsageData) {
        hasSavedUsageData = true

        // Populate meter buttons using saved data
        outputMeterButtons(window.savedUsageData)
        // Set the date to the latest date from saved data
        setDate()

    }

    if (window.usageData) {
        window.clearInterval(connectedInterval)

        // Populate meter buttons using fresh data
        outputMeterButtons(window.usageData)
        // Set the date to the latest date from fresh data
        setDate()

        const curUsageDataInterval = window.setInterval(() => {
            if (window.currentkWh) {
                window.clearInterval(curUsageDataInterval)

                setCurrentUsage()
            }
        }, 1000)
    }
}, 1000)