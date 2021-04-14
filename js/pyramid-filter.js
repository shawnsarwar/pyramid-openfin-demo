const GLOBAL_SYMBOL = "PyramidGlobalSymbol";

async function init() {
    document.getElementById("symbols").addEventListener("change", function () {
        console.log("You selected: ", this.value);
        localStorage.setItem(GLOBAL_SYMBOL, this.value);
        dispatchSymbolChange(this.value);
    });

    fin.InterApplicationBus.subscribe(
        { uuid: "*" },
        "symbolChange",
        (sub_msg) => {
            console.log(sub_msg);
            if (sub_msg) {
                document.getElementById("symbols").value = sub_msg;
            }
        }
    )
        .then(() => console.log("Subscribed to *"))
        .catch((err) => console.log(err));

    dispatchSymbolChange(document.getElementById("symbols").value);
}

async function dispatchSymbolChange(symbol) {
    localStorage.setItem("PyramidGlobalSymbol", symbol);
    fin.InterApplicationBus.publish("symbolChange", symbol)
        .then(() => console.log("Published"))
        .catch((err) => console.log(err));
}

$(document).ready(function () {
    init();
});
