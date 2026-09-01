document.addEventListener("DOMContentLoaded", async function () {

    /*
    ==========================================================
    DETERMINE SITE ROOT
    ==========================================================
    */

    const knownServiceFolders = [
        "immigrate",
        "sponsor",
        "work",
        "visit",
        "study",
        "others"
    ];


    const pathname = window.location.pathname;

    const pathParts = pathname
        .split("/")
        .filter(Boolean);


    let currentFolder = "";

    if (pathParts.length >= 2) {
        currentFolder = pathParts[pathParts.length - 2];
    }


    const isServicePage =
        knownServiceFolders.includes(currentFolder);


    const rootPrefix = isServicePage ? "../" : "";


    /*
    ==========================================================
    GENERIC INCLUDE LOADER
    ==========================================================
    */

    async function loadInclude(container, file) {

        if (!container) {
            return;
        }

        try {

            const response = await fetch(
                `${rootPrefix}_includes/${file}`
            );

            if (!response.ok) {

                throw new Error(
                    `Unable to load ${file}: ${response.status}`
                );

            }

            const html = await response.text();

            container.innerHTML = html;

        } catch (error) {

            console.error(
                `Include error for ${file}:`,
                error
            );

        }

    }


    /*
    ==========================================================
    INCLUDE LOCATIONS
    ==========================================================
    */

    const headerContainer =
        document.getElementById("site-header");

    const footerContainer =
        document.getElementById("site-footer");

    const contactFormContainer =
        document.getElementById("contact-form-include");


    /*
    ==========================================================
    LOAD INCLUDES
    ==========================================================
    */

    await Promise.all([

        loadInclude(
            headerContainer,
            "header.html"
        ),

        loadInclude(
            footerContainer,
            "footer.html"
        ),

        loadInclude(
            contactFormContainer,
            "contact-form.html"
        )

    ]);


    /*
    ==========================================================
    FIX ROOT-BASED LINKS AND IMAGES
    ==========================================================
    */

    document
        .querySelectorAll("[data-root-href]")
        .forEach(function (element) {

            const target =
                element.getAttribute("data-root-href");

            element.setAttribute(
                "href",
                `${rootPrefix}${target}`
            );

        });


    document
        .querySelectorAll("[data-root-src]")
        .forEach(function (element) {

            const target =
                element.getAttribute("data-root-src");

            element.setAttribute(
                "src",
                `${rootPrefix}${target}`
            );

        });


    /*
    ==========================================================
    ACTIVE NAVIGATION
    ==========================================================
    */

    let currentPage;


    if (isServicePage) {

        const filename =
            pathParts[pathParts.length - 1];

        currentPage =
            `${currentFolder}/${filename}`;

    } else {

        currentPage =
            pathParts[pathParts.length - 1] || "index.html";

    }


    document
        .querySelectorAll("[data-nav-page]")
        .forEach(function (link) {

            const page =
                link.getAttribute("data-nav-page");

            if (page === currentPage) {

                if (
                    link.closest(".dropdown-menu")
                ) {

                    link.classList.add(
                        "active-dropdown-link"
                    );

                } else {

                    link.classList.add("active");

                }

            }

        });


    /*
    ==========================================================
    IDENTIFY WHICH PAGE SUBMITTED THE FORM
    ==========================================================
    */

    const formSource =
        document.getElementById("formSource");

    if (formSource) {

        if (currentPage === "index.html") {
            formSource.value = "homepage";
        } else if (currentPage === "contact.html") {

            formSource.value = "contact-page";
        } else {

            formSource.value = currentPage;
        }

    }

    /*
    ==========================================================
    INFORM MAIN.JS THAT INCLUDES ARE READY
    ==========================================================
    */

    document.dispatchEvent(
        new CustomEvent("includesLoaded")
    );

});