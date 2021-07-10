$(() => {
    let bundle;
    for (let vari of location.search.substring(1).split("&")) {
        let pair = vari.split("=");
        if (decodeURIComponent(pair[0]) == "p") {
            bundle = decodeURIComponent(pair[1]);
        }
    }

    if (!bundle) {
        console.log("Package not found. Aborting.");
        return;
    }

    let shouldShowNoScreenshots = true;
    let changelogExport = "";

    console.log("Package: " + bundle);
    const bundlePath = location.href.split("?")[0] + bundle;
    const debsAPI = "https://api.github.com/repos/RedenticDev/redenticdev.github.io/commits?path=debs/";

    $.ajax({
        type: "GET",
        url: bundlePath + "/info.xml",
        dataType: "xml",
        success: function (xml) {
            console.log("Beginning XML parsing");

            // Parse the xml file and get data
            $(xml).find("packageInfo").each(() => {
                document.title = $(this).find("name").text().trim();
                const latestVersion = $(this).find("changeVersion:first").text().replace("v", "").trim();

                compatible($(this).find("miniOS").text().trim(), $(this).find("maxiOS").text().trim());

                $(xml).find("description").each(() => $("#description").append("<li>" + $(this).text().trim() + "</li>"));
                $(xml).find("dependency").each(() => $("#dependencies").append("<li>" + $(this).text().trim() + "</li>"));

                $(xml).find("change:first").each(() => {
                    $("#pill").append($(this).find("changeVersion").text().trim());
                    changelogExport += "<li>";
                    $(this).find("changeDescription").each(() => {
                        changelogExport += "<h2>- " + $(this).text().trim() + "</h2>";
                    });
                    changelogExport += "</li>";
                });
                lastUpdateDate(debsAPI + bundle + "_" + latestVersion + "_iphoneos-arm.deb").then(res => $("#changelog-date").append(res));
                $("#changelog").append(changelogExport + "<table><tr><td><a href=\"changelog/?p=" + bundle + "\" target=\"_blank\">Full changelog</a></td></tr></table>");

                $(xml).find("screen").each(() => {
                    shouldShowNoScreenshots = false;
                    $("#screenshots").append("<li><a href=\"" + bundlePath + "/" + $(this).text().trim() + "\" target=\"_blank\"><img src=\"" + bundlePath + "/" + $(this).text().trim() + "\" draggable=\"false\" /></a></li>");
                });

                if (shouldShowNoScreenshots) $("#screenshots").append("<li>No screenshots provided.</li>");

                $("#infoTable").append("<tr><th>Developer</th><td>" + $(this).find("developer").text().trim() + "</td></tr>");
                $("#infoTable").append("<tr><th>Price</th><td>Free</td></tr>");
                $("#infoTable").append("<tr><th>Version</th><td>" + latestVersion + "</td></tr>");
                $("#infoTable").append("<tr><th>iOS Version</th><td>iOS " + $(this).find("miniOS").text().trim() + " to " + $(this).find("maxiOS").text().trim() + "</td></tr>");
                $("#infoTable").append("<tr><th>Last update</th></td><td id=\"last-update\"></td></tr>");
                $("#infoTable").append("<tr><th>Release date</th></td><td id=\"release-date\"></td></tr>");
                lastUpdateDate(debsAPI + bundle + "_" + latestVersion + "_iphoneos-arm.deb").then(res => $("#last-update").append(res));
                lastUpdateDate(debsAPI + bundle + "_" + $(this).find("changeVersion:last").text().replace("v", "").trim() + "_iphoneos-arm.deb").then(res => $("#release-date").append(res));
                // $("#infoTable").append("<tr><th>Downloads</th><td>" +  + "</td></tr>");
                $("#infoTable").append("<tr><th>Category</th><td>" + $(this).find("category").text().trim() + "</td></tr>");

                $("#links").append("<tr><td><a href=\"" + $(this).find("github").text().trim() + "\" target=\"_blank\"><img src=\"https://is1-ssl.mzstatic.com/image/thumb/Purple125/v4/a8/34/3c/a8343c15-9a86-ce5f-6218-0b0c41af08f4/AppIcon-0-1x_U007emarketing-0-7-0-85-220.png/217x0w.png\" alt=\"GitHub icon\" />GitHub</a></td></tr>");
                $("#links").append("<tr><td><a href=\"" + $(this).find("twitter").text().trim() + "\" target=\"_blank\"><img src=\"https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/33/eb/b3/33ebb37c-f1f1-8e40-8d88-9dc483fb4a2e/ProductionAppIcon-1x_U007emarketing-0-7-0-0-0-85-220.png/217x0w.png\" alt=\"Twitter icon\" />Twitter</a></td></tr>");
                $("#links").append("<tr><td><a href=\"" + $(this).find("reddit").text().trim() + "\" target=\"_blank\"><img src=\"https://is2-ssl.mzstatic.com/image/thumb/Purple115/v4/27/6d/03/276d03c0-7886-4f78-da37-844b679d6c01/AppIcon-1x_U007emarketing-0-7-0-85-220.png/217x0w.png\" alt=\"Reddit icon\" />Reddit</a></td></tr>");
                let [discordName, discordHash, discordId] = $(this).find("discord").text().trim().split('|');
                $("#links").append("<tr><td><a href=\"https://discord.com/users/" + discordId + "/\" target=\"_blank\"><img src=\"https://is3-ssl.mzstatic.com/image/thumb/Purple125/v4/5e/be/72/5ebe7274-4a54-36e5-a229-854d142dbbfe/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/217x0w.png\" alt=\"Discord icon\" />Discord (" + discordName + "#" + discordHash + ")</a></td></tr>");
                $("#links").append("<tr><td><a href=\"" + $(this).find("mail").text().trim() + "\" target=\"_blank\"><img src=\"https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/c7/40/e5/c740e5f0-2a62-4fa7-dc1b-66ea3d519545/AppIcon-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-10.png/217x0w.png\" alt=\"Apple Mail icon\" />Mail</a></td></tr>");
                $("#links").append("<tr><td><a href=\"" + $(this).find("paypal").text().trim() + "\" target=\"_blank\"><img src=\"https://is5-ssl.mzstatic.com/image/thumb/Purple125/v4/66/37/0d/66370de2-4c2c-43d2-1f2b-dd4b0c5e563a/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/217x0w.png\" alt=\"PayPal icon\" />Paypal</a></td></tr>");
            });
            console.log("XML parsing done.");
        }
    });
});

$("img").bind("dragstart", () => false);
$("img").bind("mousedown", () => false);

function lastUpdateDate(url) {
    return new Promise((resolve, reject) => {
        const formatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
        try {
            // Switched to a GitHub-specific last commit
            // date fetching system
            const req = new XMLHttpRequest();
            req.onload = () => {
                if (req.status == 200 && req.readyState == 4) {
                    const date = new Date(JSON.parse(req.responseText)[0].commit.committer.date);
                    console.log("Date successfully fetched for url: " + url + " (" + date + ")");
                    resolve(date.toLocaleDateString("en-US", formatOptions));
                } else reject("Error (status: " + req.status + ", state: " + req.readyState + ")");
            }
            req.open("GET", url, true);
            req.send();
        } catch (er) {
            reject(er.message);
        }
    });
}

// Inspired by Silica
function compatible(works_min, works_max) {
    // iOS version detection by Dylan Duff
    // Does not work for iPadOS, as iPadOS is seen by the browser as a Mac :/
    const currentiOS = parseFloat(("" + (/CPU.*OS ([0-9_]{1,})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", ""));
    works_min = numerize(works_min);
    works_max = numerize(works_max);

    const text = document.getElementById("compatibility");
    const textContainer = document.getElementById("compatibility-box");

    if (currentiOS < works_min) {
        text.innerHTML = "Your iOS version is too old for this package. It is compatible from iOS " + works_min + " to " + works_max + ".";
        text.style.color = "red";
        textContainer.style.backgroundColor = "lightpink";
        textContainer.style.border = "1px solid red";
    } else if (currentiOS > works_max) {
        text.innerHTML = "This package has not been tested yet with your iOS version. It works from iOS " + works_min + " to " + works_max + ".";
        text.style.color = "goldenrod";
        textContainer.style.backgroundColor = "lightyellow";
        textContainer.style.border = "1px solid goldenrod";
    } else if (String(currentiOS) != "NaN") {
        text.innerHTML = "This package works on your device!";
        text.style.color = "green";
        textContainer.style.backgroundColor = "lightgreen";
        textContainer.style.border = "1px solid green";
    } else {
        text.innerHTML = "Cannot determine your version. Open this page on an iOS device to check compatibility.";
        text.style.fontStyle = "italic";
    }
}

function numerize(x) {
    return x.substring(0, x.indexOf(".")) + "." + x.substring(x.indexOf(".") + 1).replace(".", "");
}
