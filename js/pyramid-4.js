var client;

function createEmbedClient() {
    var url = "https://demo2020.pyramidanalytics.com";
    client = new PyramidEmbedClient(url);
}

function embed(filterBy) {
    var filter;
    var target;

    if (filterBy) {
        filter = Filter.create().addUniqueName(filterBy);
        target = Target.create().add(filter, "Target1", false);
    }

    setTimeout(() => {
        const el = document.getElementById("pyramid-container-1");
        client.embed(el, {
            contentId: "5f9c6997-f135-482b-94a2-817c31cc1f2e",
            filters: filter,
        });
    }, 500);

    // setTimeout(() => {
    //     client.embed($("#pyramid-container-2")[0], {
    //         contentId: "485d3846-d1c8-499f-ad90-bec8788c8700",
    //         targets: target,
    //     });
    // }, 1000);
}

async function offWindow() {
    return fin.Platform.getCurrentSync().applySnapshot({
        windows: [
            {
                defaultWidth: 600,
                defaultHeight: 600,
                defaultLeft: 200,
                defaultTop: 200,
                saveWindowState: false,
                url: window.location.href,
                contextMenu: true,
            },
        ],
    });
}

async function openFilterWindow() {
    return fin.Platform.getCurrentSync().applySnapshot({
        windows: [
            {
                defaultWidth: 300,
                defaultHeight: 80,
                defaultLeft: 200,
                defaultTop: 200,
                saveWindowState: false,
                url: "pyramid-filter.html",
                contextMenu: true,
                alwaysOnTop: true,
                smallWindow: true,
                maximizable: false,
            },
        ],
    });
}

async function init() {
    document
        .getElementById("btnOffWindow")
        .addEventListener("click", function () {
            openFilterWindow();
        });
}

async function updateTradeView(url) {
    // const view = await fin.View.wrap({
    //     uuid: "PyramidTradeView",
    //     name: "PyramidTradeView",
    // });
    // //const currentView = fin.View.getCurrentSync();

    // if (view) {
    //     return view.navigate(url);
    // }

    // if (view) {
    //     const viewOptions = {
    //         url: url,
    //         printName: "TradeView",
    //         processAffinity: "tv_1",
    //         uuid: "PyramidTradeView",
    //     };
    //     await fin.Platform.getCurrentSync().createView(
    //         viewOptions,
    //         fin.me.identity
    //     );
    // }

    // const view = await fin.View.wrap({ uuid: "PyramidTradeView" });
    // if (view) {
    //     const options = await view.getOptions();
    //     const newOptions = { ...options, url: url };
    //     await view.updateOptions(newOptions);
    //     //await view.navigate(url);
    // }
    // let win = fin.Window.wrapSync({ uuid: "PyramidTradeView" });
    // if (win) {
    //     win.navigate(url);
    // }
}

$(document).ready(function () {
    fin.InterApplicationBus.subscribe(
        { uuid: "*" },
        "symbolChange",
        (sub_msg) => {
            console.log(sub_msg);
            if (sub_msg) {
                embed(`[Companies].[symbol].[${sub_msg}]`);
            }

            const url = `https://www.tradingview.com/chart/?symbol=NASDAQ:${sub_msg}`;
            updateTradeView(url);
        }
    )
        .then(() => console.log("Subscribed to *"))
        .catch((err) => console.log(err));

    createEmbedClient();
    embed();
    init();
});

$("#countries").on("change", function () {
    embed(this.value);
});



