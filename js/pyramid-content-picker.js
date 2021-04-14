var apiToken;
var apiUser;
var jsTreeContainerId;

const HOST = "https://demo2020.pyramidanalytics.com";

async function getUserPublicRootFolder() {
    const body = JSON.stringify({
        userId: apiUser.id,
        auth: apiToken,
    });
    const response = await fetch(
        `${HOST}/API2/content/getUserPublicRootFolder?q=${body}`
    );
    const json = await response.json();
    return json.data;
}

async function getUserPrivateRootFolder() {
    const body = JSON.stringify({
        userId: apiUser.id,
        auth: apiToken,
    });
    const response = await fetch(
        `${HOST}/API2/content/getUserPrivateRootFolder?q=${body}`
    );
    const json = await response.json();
    return json.data;
}

async function getUserGroupRootFolder() {
    const body = JSON.stringify({
        userId: apiUser.id,
        auth: apiToken,
    });
    const response = await fetch(
        `${HOST}/API2/content/getUserGroupRootFolder?q=${body}`
    );
    const json = await response.json();
    return json.data;
}

async function getFolderItems(folderId) {
    const body = JSON.stringify({
        folderId,
        auth: apiToken,
    });
    const response = await fetch(
        `${HOST}/API2/content/getFolderItems?q=${body}`
    );
    const json = await response.json();
    return json.data;
}

async function getApiToken() {
    const body = JSON.stringify({
        data: {
            username: "xxx",
            password: "xxx",
        },
    });
    const response = await fetch(
        `${HOST}/API2/auth/authenticateUser?q=${body}`
    );
    const token = await response.text();
    return token;
}

async function getApiUser(token) {
    const body = JSON.stringify({
        auth: token,
    });
    const response = await fetch(`${HOST}/API2/access/getMe?q=${body}`);
    const json = await response.json();
    return json.data;
}

function initTreeView(containerId) {
    $(`#${containerId}`).jstree({
        core: {
            themes: {
                name: "default-dark",
                dots: false,
                icons: true,
            },
            data: async (node, cb) => {
                if (node.id === "#") {
                    const [
                        // privateFolder,
                        publicFolder,
                        groupFolder,
                    ] = await Promise.all([
                        // getUserPrivateRootFolder(),
                        getUserPublicRootFolder(),
                        getUserGroupRootFolder(),
                    ]);
                    cb([
                        // {
                        //     text: privateFolder.caption,
                        //     id: privateFolder.id,
                        //     children: true,
                        // },
                        {
                            text: groupFolder.caption,
                            id: groupFolder.id,
                            children: true,
                        },
                        {
                            text: publicFolder.caption,
                            id: publicFolder.id,
                            children: true,
                        },
                    ]);
                } else {
                    const items = await getFolderItems(node.id);
                    const nodes = items
                        .filter(
                            (i) =>
                                i.contentType === 8 ||
                                i.contentType === 3 ||
                                i.contentType === 5
                        )
                        .map((i) => {
                            return {
                                text: i.caption,
                                id: i.id,
                                children: i.itemType === 5,
                                type:
                                    i.contentType === 3
                                        ? "discovery"
                                        : i.contentType === 8
                                        ? "storyboard"
                                        : null,
                            };
                        });
                    const sortedFoldersNodes = nodes
                        .filter((n) => n.children)
                        .sort((a, b) => a.text.localeCompare(b.text));
                    const sortedChildrenNodes = nodes
                        .filter((n) => !n.children)
                        .sort((a, b) => a.text.localeCompare(b.text));
                    cb([...sortedFoldersNodes, ...sortedChildrenNodes]);
                }
            },
        },
        types: {
            discovery: {
                icon: "pyramid-discovery-content-type",
            },
            storyboard: {
                icon: "pyramid-storyboard-content-type",
            },
            default: {},
        },
        plugins: ["themes", "types"],
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export async function initPyramidContentPicker(containerId) {
    jsTreeContainerId = containerId;
    //apiToken = await getApiToken();
    apiToken = getCookie("PyramidAuth");
    apiUser = await getApiUser(apiToken);
    initTreeView(containerId);
}

export function getSelectedContentId() {
    const selectedNodes = $(`#${jsTreeContainerId}`)
        .jstree()
        .get_selected("full", true);
    const selectedContentNodes = selectedNodes.filter(
        (n) => n.type === "discovery" || n.type === "storyboard"
    );

    if (selectedContentNodes.length > 0) {
        return selectedContentNodes[0].id;
    }
    return null;
}
