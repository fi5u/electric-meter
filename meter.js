// https://repl.it/@tf/BonyWittyChief
const years = []
const maxUnconsolidatedDates = 2

let isLocked = false

/**
 * Add an array of numbers, ensures current number exists
 * @param {number} runningTotal Running total
 * @param {number} currentNumber Current number
 */
function additionReducer(runningTotal, currentNumber) {
    if (currentNumber) {
        return runningTotal + currentNumber
    }
    return runningTotal
}

/**
 * Change date array from arrays of counts within hours,
 * to an int of number in whole day.
 * Convert everything prior to maxUnconsolidatedDates dates ago.
 */
function consolidate() {
    const latestYearIndex = years.length - 1
    const latestMonthIndex = years[latestYearIndex].length - 1
    const latestDateIndex = years[latestYearIndex][latestMonthIndex].length - 1

    // Consolidate the previous full day
    if (latestDateIndex > maxUnconsolidatedDates) {
        const date = years[latestYearIndex][latestMonthIndex][latestDateIndex - maxUnconsolidatedDates]

        if (!date) {
            return
        }

        years[latestYearIndex][latestMonthIndex][latestDateIndex - maxUnconsolidatedDates] = date.reduce(additionReducer, 0)
    } else {
        // Is previous month
        if (latestMonthIndex > 0) {
            const dateIndex = years[latestYearIndex][latestMonthIndex - 1].length - maxUnconsolidatedDates + latestDateIndex - 1

            const prevMonthDate = years[latestYearIndex][latestMonthIndex - 1][dateIndex]

            if (!prevMonthDate) {
                return
            }

            years[latestYearIndex][latestMonthIndex - 1][dateIndex] = prevMonthDate.reduce(additionReducer, 0)
        } else {
            const dateIndex = 31 - maxUnconsolidatedDates + latestDateIndex
            // Is previous year
            years[latestYearIndex - 1][11][dateIndex] = years[latestYearIndex - 1][11][dateIndex].reduce(additionReducer, 0)
        }
    }
}

/**
 * Get the last 2 digits of full year
 * @param {number} year Year to parse
 * @return {number}
 */
function getYear(year) {
    return parseInt(year.toString().substr(-2))
}

/**
 * Increment count, create new year, month, date, hour as needed
 */
function increment() {
    const d = new Date()
    const hour = d.getHours()
    const date = d.getDate()
    const month = d.getMonth()
    const year = d.getFullYear()

    // 2-digit year, as number
    const yr = getYear(year)

    if (years[yr]) {
        if (years[yr][month]) {
            if (years[yr][month][date]) {
                if (years[yr][month][date][hour]) {
                    years[yr][month][date][hour]++
                } else {
                    // No hour in current date
                    years[yr][month][date][hour] = 1
                }
            } else {
                // No date in current month
                years[yr][month][date] = new Int16Array(24)
                years[yr][month][date][hour] = 1

                // Consolidate previous dates
                consolidate()
            }
        } else {
            // No month in current year
            years[yr][month] = []
            years[yr][month][date] = new Int16Array(24)
            years[yr][month][date][hour] = 1

            // Consolidate previous dates
            consolidate()
        }
    } else {
        // Current year not yet created
        years[yr] = []
        years[yr][month] = []
        years[yr][month][date] = new Int16Array(24)
        years[yr][month][date][hour] = 1

        // Consolidate previous dates
        consolidate()
    }
}

/**
 * Watch fires an update
 */
function update() {
    increment()
}

/**
 * Initialization function
 */
function onInit() {
    clearWatch()
    D1.write(0)
    pinMode(D2, 'input_pullup')
    setWatch(function (e) {
        if (!isLocked) {
            isLocked = true

            update()
            digitalPulse(LED1, 1, 1) // Show activity

            // Release lock
            setTimeout(() => {
                isLocked = false
            }, 100)
        }
    }, D2, { repeat: true, edge: 'falling' })
}