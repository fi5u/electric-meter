const savedYears = window.localStorage.getItem('years')

if (savedYears) {
    window.savedUsageData = JSON.parse(savedYears)
}

function connectDevice() {
    const button = document.getElementById('connect-button')

    // Disable connect button
    button.disabled = true
    button.textContent = 'Connecting...'

    // connect, issue Ctrl-C to clear out any data that might have been left in REPL
    Puck.write("\x03", function () {
        setTimeout(function () {
            // After a short delay ask for the battery percentage
            Puck.eval('E.getBattery()', function (d) {
                if (!d) {
                    console.log('Battery error:')
                    button.textContent = 'Failed to connect'
                    return
                }

                button.textContent = 'Connected'

                // Update battery meter
                const batteryEl = document.getElementById('battery')
                batteryEl.textContent = d
                battery.level = d

                Puck.eval('years', function (d) {
                    console.log(d)
                    window.usageData = d
                    window.localStorage.setItem('years', JSON.stringify(d))
                });

                Puck.eval('currentkWh', function (currentkWh) {
                    console.log(currentkWh)
                    window.currentkWh = currentkWh
                })
            })
        }, 1000 * 10);
    });
}
