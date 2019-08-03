function connectDevice() {
    const button = document.getElementById('connect-button')

    // Disable connect button
    button.disabled = true
    button.textContent = 'Connecting...'

    // Connect, issue Ctrl-C to clear out any data that might have been left in REPL
    Puck.write("\x03", function () {
        setTimeout(function () {
            // After a short delay ask for the battery percentage
            Puck.eval('E.getBattery()', function (batteryPercentage) {
                if (!batteryPercentage) {
                    console.log('Battery error:')
                    button.textContent = 'Failed to connect'
                    return
                }

                button.textContent = 'Connected'

                // Update battery meter
                const batteryEl = document.getElementById('battery-container')
                batteryEl.textContent = `Battery: ${batteryPercentage}%`

                document.documentElement.classList.remove('not-connected')

                Puck.eval('years', function (years) {
                    // Ensure a valid array is returned
                    if (typeof years !== 'object' || years.length < 20) {
                        return
                    }

                    console.log(years)
                    window.usageData = years

                    Puck.eval('currentkWh', function (currentkWh) {
                        window.currentkWh = currentkWh
                    })
                });
            })
        }, 1000 * 2);
    });
}
