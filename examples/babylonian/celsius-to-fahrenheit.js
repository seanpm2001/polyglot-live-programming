// <Example :name="cold" celsius="-10" />
// <Example  celsius="30"   :name="warm"  />
function celsiusToFahrenheit(celsius) {
    // <Probe :expression="celsius * Math.random()" />
    // <Assertion :expression="2 == 1 + 1" />
    // <Assertion :example="cold" :expected="14" />
    return celsius * 9/5 + 32;
}
