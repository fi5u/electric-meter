let currentTimeframe = 'day'
let hasSavedUsageData = false

/**
 * Initialization functions
 */
async function dataInit() {
    const historicData = await fetchHistoricData()

    if (historicData) {
        window.savedUsageData = historicData
    }
}

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
 * Fetch historic data from cloud
 * @return {Array} Historic data
 */
async function fetchHistoricData() {
    try {
        const response = await fetch('/api/historic_data')
        const data = await response.json()

        if (!data) {
            throw new Error('No data returned')
        }

        return JSON.parse(data)
    } catch (error) {
        console.log('Error fetching historic data:')
        console.log(error.message)
    }
}

/**
 * Save data to cloud
 * @param {Array} data Data to save to cloud
 */
async function saveHistoricData(data) {
    try {
        await fetch('/api/historic_data', {
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            method: 'POST',
        })
    } catch (error) {
        console.log('Error saving historic data:')
        console.log(error.message)
    }
}

/**
 * Recursively merge arrays of data
 * @param {Array} oldData Old array data
 * @param {Array} newData New array data
 */
function generateMergedData(oldData, newData) {
    const merged = []

    for (let i = 0; i < newData.length; i++) {
        const current = newData[i]

        // No data or data is identical
        if (!oldData || current === oldData[i]) {
            merged[i] = current
            continue
        }

        // No current data, but have old, keep the old
        if (!current && oldData[i]) {
            merged[i] = oldData[i]
            continue
        }

        // Always accept current as latest when number
        if (typeof current === 'number') {
            merged[i] = current
            continue
        }

        // Is array
        if (typeof current === 'object') {
            merged[i] = generateMergedData(oldData[i], current)
            continue
        }
    }

    return merged
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
    label.className = `uk-button uk-button-${isChecked ? 'primary uk-disabled' : 'default'} uk-flex-1`
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

/**
 * Set up date selector buttons and fetch data for date
 * @param {number} [date.year]
 * @param {number} [date.month]
 * @param {number} [date.date]
 */
function setButtonsAndData(date) {
    outputMeterButtons(window.usageData || window.savedUsageData, date)
    setDate(date)
}

/**
 * Set the classes for buttons
 * @param {number} [date.year]
 * @param {number} [date.month]
 * @param {number} [date.date]
 */
function setButtonsState(date) {
    const container = document.getElementById('meter-buttons')

    if (!container) {
        return
    }

    const labels = container.querySelectorAll('label')

    if (!labels) {
        return
    }

    // Disable all
    labels.forEach(label => {
        label.classList.remove('uk-button-primary')
        label.classList.remove('uk-disabled')
        label.classList.add('uk-button-default')
    })

    // Enable for each key
    Object.keys(date).forEach(dateKey => {
        const container = document.getElementById(`meter-buttons-${dateKey}`)
        if (container) {
            const element = container.querySelector(`label[for=${dateKey}-${date[dateKey]}]`)

            if (element) {
                element.classList.remove('uk-button-default')
                element.classList.add('uk-button-primary')
                element.classList.add('uk-disabled')
            }
        }
    })
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

    // Set button classes
    if (date) {
        setButtonsState(date)
    }
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
    element.textContent = `Current: ${window.currentkWh} kWh`
}

/**
 * Merge current data with historical data, then save to cloud
 */
function mergeHistory() {
    if (!window.usageData) {
        console.error('No current data, cannot merge history')
        return
    }

    const mergedHistory = generateMergedData(window.savedUsageData, window.usageData)

    if (!mergedHistory) {
        console.error('Merged history could not be generated')
        return
    }

    console.log('mergedHistory:')
    console.log(mergedHistory)

    window.usageData = mergedHistory

    saveHistoricData({ years: mergedHistory })
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

        // Merge new with old history
        mergeHistory()

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

// Perform initialization tasks
dataInit()