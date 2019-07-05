const battery = {
    level: 0
}

const counter = {
    value: 0
}

function connectDevice() {
    const button = document.getElementById('connect-button')

    // Disable connect button
    button.disabled = true
    button.textContent = 'Connecting...'

    Puck.eval('c', (data, initialConnectError) => {
        if (initialConnectError) {
            console.log('Inital connect error:')
            console.log(initialConnectError)
            return
        }

        button.textContent = 'Connected'

        // Update count element
        const countEl = document.getElementById('count')
        countEl.textContent = data.count

        Puck.eval('{bat:E.getBattery()}', function (d, batteryError) {
            if (batteryError) {
                console.log('Battery error:')
                console.log(batteryError)
                return
            }

            // Update battery meter
            const batteryEl = document.getElementById('battery')
            batteryEl.textContent = d.bat
            battery.level = d.bat
        })
    })
}

// function connectDevice() {
//     // Connect, and request battery percentage
//     Puck.eval('{bat:E.getBattery()}', function (d, error) {
//         if (!d) {
//             alert(
//                 'Web Bluetooth connection failed!\n' + (error || '')
//             )
//             return
//         }

//         // Update battery meter
//         const batteryEl = document.getElementById('battery')
//         batteryEl.textContent = d.bat
//         battery.level = d.bat

//         // Get counter value
//         Puck.eval('c', (count, error) => {
//             if (error) {
//                 console.log('Error:')
//                 console.log(error)
//             }

//             const countEl = document.getElementById('count')
//             countEl.textContent = count

//         })
//     })
// }

// window.setTimeout(connectDevice, 1000)