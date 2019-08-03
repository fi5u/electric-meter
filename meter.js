// https://repl.it/@tf/BonyWittyChief
const years = [];
let lastFlashTime = Date.now();
let currentkWh = 0


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
                years[yr][month][date] = new Uint16Array(24)
                years[yr][month][date][hour] = 1
            }
        } else {
            // No month in current year
            years[yr][month] = []
            years[yr][month][date] = new Uint16Array(24)
            years[yr][month][date][hour] = 1
        }
    } else {
        // Current year not yet created
        years[yr] = []
        years[yr][month] = []
        years[yr][month][date] = new Uint16Array(24)
        years[yr][month][date][hour] = 1
    }
}

/**
 * Set the current usage in kWh from timings of flashes
 */
function setCurrentUsage() {
    const currentTime = Date.now()
    const diffMs = currentTime - lastFlashTime
    const diffSec = diffMs / 1000

    const kWh = (3600 / diffSec) * 0.001
    const decimalPlaces = 2

    currentkWh = Number(Math.round(kWh + 'e' + decimalPlaces) + 'e-' + decimalPlaces)
    lastFlashTime = currentTime
}

/**
 * Watch fires an update
 */
function update() {
    increment()
    setCurrentUsage()
}

/**
 * Initialization function
 */
function onInit() {
    clearWatch()
    D1.write(0)
    pinMode(D2, 'input_pullup')
    setWatch(function (e) {
        update()
        digitalPulse(LED1, 1, 1) // Show activity
    }, D2, { repeat: true, edge: 'falling' })
}