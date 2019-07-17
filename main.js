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
                    button.textContent = 'Failed to connect'
                    return
                }

                button.textContent = 'Connected'

                // Update battery meter
                const batteryEl = document.getElementById('battery')
                batteryEl.textContent = d.bat
                battery.level = d.bat

                Puck.eval('years', function (d) {
                    console.log(d)
                    window.usageData = d
                });
            })
        }, 1000 * 10);
    });
}
