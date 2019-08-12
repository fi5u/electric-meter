// https://repl.it/@tf/BonyWittyChief
let years = []
let lastFlashTime = Date.now()
let currentkWh = 0
let isLocked = false


/**
 * Get the last 2 digits of full year
 * @param {number} year Year to parse
 * @return {number}
 */
function getYear(year) {
    try {
        return parseInt(year.toString().substr(-2))
    } catch (error) {
        console.log('Error in getYear():')
        console.log(error)
    }
}

/**
 * Increment count, create new year, month, date, hour as needed
 */
function increment() {
    try {
        let d = new Date()
        let hour = d.getHours()
        let date = d.getDate()
        let month = d.getMonth()
        let year = d.getFullYear()

        // 2-digit year, as number
        let yr = getYear(year)

        if (years[yr]) {
            try {
                if (years[yr][month]) {
                    try {
                        if (years[yr][month][date]) {
                            try {
                                if (years[yr][month][date][hour]) {
                                    years[yr][month][date][hour]++
                                } else {
                                    // No hour in current date
                                    years[yr][month][date][hour] = 1
                                }
                            } catch (error) {
                                console.log('Error in increment() hour:')
                                console.log(error)
                            }
                        } else {
                            // No date in current month
                            years[yr][month][date] = new Uint16Array(24)
                            years[yr][month][date][hour] = 1
                        }
                    } catch (error) {
                        console.log('Error in increment() date:')
                        console.log(error)
                    }
                } else {
                    // No month in current year
                    years[yr][month] = []
                    years[yr][month][date] = new Uint16Array(24)
                    years[yr][month][date][hour] = 1
                }
            } catch (error) {
                console.log('Error in increment() month:')
                console.log(error)
            }
        } else {
            // Current year not yet created
            years[yr] = []
            years[yr][month] = []
            years[yr][month][date] = new Uint16Array(24)
            years[yr][month][date][hour] = 1
        }
    } catch (error) {
        console.log('Error inside increment():')
        console.log(error)
    }
}

/**
 * Set the current usage in kWh from timings of flashes
 */
function setCurrentUsage() {
    try {
        let currentTime = Date.now()
        let diffMs = currentTime - lastFlashTime
        let diffSec = diffMs / 1000

        let kWh = (3600 / diffSec) * 0.001
        let decimalPlaces = 2

        currentkWh = Number(Math.round(kWh + 'e' + decimalPlaces) + 'e-' + decimalPlaces)
        lastFlashTime = currentTime
    } catch (error) {
        console.log('Error in setCurrentUsage:')
        console.log(error)
    }
}

/**
 * Watch fires an update
 */
function update() {
    try {
        increment()
    } catch (error) {
        console.log('Error calling increment:')
        console.log(error)
    }

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
        try {
            if (isLocked) {
                return
            }

            isLocked = true
            update()
            digitalPulse(LED2, 1, 1) // Green

            setTimeout(() => {
                isLocked = false
            }, 300)
        } catch (error) {
            digitalPulse(LED1, 1, 1) // Red
            console.log(error)
        }
    }, D2, { repeat: true, edge: 'falling' })
}