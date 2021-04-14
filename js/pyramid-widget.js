import {
    initPyramidContentPicker,
    getSelectedContentId,
} from "../js/pyramid-content-picker.js";

var client;

const HOST = "https://demo2020.pyramidanalytics.com";
const LIGHT_THEME = "light-theme";
const DARK_THEME = "dark";

function createEmbedClient() {
    var url = HOST;
    client = new PyramidEmbedClient(url);
}

async function initUI() {
    const contentId = await getSavedContentId();

    if (contentId) {
        $("#new-content-form").hide();
        $("#pyramid-container").show();
        $("#resetContent").show();
    } else {
        $("#new-content-form").show();
        $("#pyramid-container").hide();
        $("#resetContent").hide();
    }

    $("#btnSet").on("click", async () => {
        const contentId = getSelectedContentId(); //$("#txtContentId").val();
        if (contentId) {
            await fin.Platform.getCurrentSync().setWindowContext({ contentId });
            onContentIdChanged();
        }
    });

    $("#resetContent").on("click", async () => {
        await fin.Platform.getCurrentSync().setWindowContext({
            contentId: null,
        });
        onContentIdChanged();
    });
}

function subscribeToSymbolChangeEvent() {
    fin.InterApplicationBus.subscribe(
        { uuid: "*" },
        "symbolChange",
        (sub_msg) => {
            console.log(sub_msg);
            if (sub_msg) {
                embed(false, sub_msg);
            }
        }
    )
        .then(() => console.log("Subscribed to *"))
        .catch((err) => console.log(err));
}

async function embed(firstEmbedding, symbol = localStorage.getItem("PyramidGlobalSymbol")) {
    const filterBy = symbol ? `[Companies].[symbol].[${symbol}]` : null;
    var filter;
    var target;

    const contentId = await getSavedContentId();

    if (!contentId) {
        return;
    }

    if (filterBy) {
        filter = Filter.create().addUniqueName(filterBy);
        target = Target.create().add(filter, "symbol", false);
    }

    const el = document.getElementById("pyramid-container");

    if (!firstEmbedding && target && window["pyramid"] && pyramid && pyramid.stop) {
        pyramid.stop(el);
    }

    client.embed(el, {
        contentId: contentId,
        filters: filter,
        targets: target,
    });
}

async function getSavedContentId() {
    const initialContext = await fin.Platform.getCurrentSync().getWindowContext();
    return initialContext && initialContext.contentId;
}

async function onContentIdChanged() {
    await initUI();
    embed(true);
}

$(document).ready(async () => {
    await initUI();
    createEmbedClient();
    embed(true);
    subscribeToSymbolChangeEvent();

    initPyramidContentPicker("treeView");
});
