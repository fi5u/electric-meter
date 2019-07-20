// https://repl.it/@tf/BonyWittyChief
const years = []
let isLocked = false


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
                years[yr][month][date] = []
                years[yr][month][date][hour] = 1
            }
        } else {
            // No month in current year
            years[yr][month] = []
            years[yr][month][date] = []
            years[yr][month][date][hour] = 1
        }
    } else {
        // Current year not yet created
        years[yr] = []
        years[yr][month] = []
        years[yr][month][date] = []
        years[yr][month][date][hour] = 1
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