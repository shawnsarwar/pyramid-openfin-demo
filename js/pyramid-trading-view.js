$(document).ready(function () {
    setWidget();

    fin.InterApplicationBus.subscribe(
        { uuid: "*" },
        "symbolChange",
        (sub_msg) => {
            console.log(sub_msg);
            //setUrl(sub_msg);
            setWidget(sub_msg);
        }
    )
        .then(() => console.log("Subscribed to *"))
        .catch((err) => console.log(err));
});

function setWidget(symbol = localStorage.getItem("PyramidGlobalSymbol")) {
    new TradingView.widget({
        width: 630,
        height: 610,
        symbol: `NASDAQ:${symbol || "GOOG"}`,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview_62394",
    });
}
