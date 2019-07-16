window.usageData = {}
window.dataLoaded = false

function connectDevice() {
    const button = document.getElementById('connect-button')

    // Disable connect button
    button.disabled = true
    button.textContent = 'Connecting...'

    // connect, issue Ctrl-C to clear out any data that might have been left in REPL
    Puck.write("\x03", function () {
        setTimeout(function () {
            // After a short delay ask for the battery percentage
            Puck.eval("{bat:Puck.getBatteryPercentage()}", function (d, batteryError) {
                if (!d || batteryError) {
                    console.log('Battery error:')
                    console.log(batteryError)
                    return
                }

                button.textContent = 'Connected'

                // Update battery meter
                const batteryEl = document.getElementById('battery')
                batteryEl.textContent = d.bat
                battery.level = d.bat

                Puck.eval("years", function (d) {
                    processData(d)
                    console.log(d)
                    window.dataLoaded = true
                });
            })
        }, 1000 * 10);
    });
}

function processData(data) {
    const latestYearData = data[data.length - 1]
    const latestMonthData = latestYearData[latestYearData.length - 1]
    const latestDateData = latestMonthData[latestMonthData.length - 1]

    window.usageData.today = latestDateData
    window.usageData.yesterday = latestMonthData.length > 1
        // Yesterday in same month
        ? latestMonthData[latestMonthData.length - 2]
        // Yesterday in previous month
        : latestYearData.length > 1
            // Yesterday in previous month in same year
            ? latestYearData[latestYearData.length - 2][latestYearData[latestYearData.length - 2].length - 1]
            // Yesterday in Dec in previous year
            : data[data.length - 2][11][30]
}