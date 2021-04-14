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
        target = Target.create().add(filter, "symbol", false);
    }

    if (window['pyramid'] && pyramid && pyramid.stop) {
        pyramid.stop($("#pyramid-container-1")[0]);
    }

    client.embed($("#pyramid-container-1")[0], {
        contentId: "f097cb95-47d4-4446-86e9-9a0f25835c84",
        //contentId: '4137610a-1735-4110-9187-2c94a09dda32',
        //contentId: "4137610a-1735-4110-9187-2c94a09dda32",
        targets: target,
    });
}

async function offWindow() {
    return fin.Platform.getCurrentSync().applySnapshot({
        windows: [
            {
                defaultWidth: 1280,
                defaultHeight: 720,
                defaultLeft: 100,
                defaultTop: 100,
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

$(document).ready(function () {
    fin.InterApplicationBus.subscribe(
        { uuid: "*" },
        "symbolChange",
        (sub_msg) => {
            console.log(sub_msg);
            if (sub_msg) {
                embed(`[Companies].[symbol].[${sub_msg}]`);
            }
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
