function Counter() {
    this.clear();
}

/// Clear the counters back to zero
Counter.prototype.clear = function () {
    this.count = 0;
};

Counter.prototype.increment = function () {
    this.count++;
};

var c = new Counter();

// Update BLE advertising
function update() {
    var a = new ArrayBuffer(4);
    var d = new DataView(a);
    d.setUint32(0, c.count, false);
    NRF.setAdvertising({}, {
        name: "Puck.js \xE2\x9A\xA1",
        manufacturer: 0x0590,
        manufacturerData: a,
        interval: 600 // default is 375 - save a bit of power
    });
}

function onInit() {
    clearWatch();
    D1.write(0);
    pinMode(D2, "input_pullup");
    setWatch(function (e) {
        c.increment();
        update();
        digitalPulse(LED1, 1, 1); // show activity
    }, D2, { repeat: true, edge: "falling" });
    update();
}