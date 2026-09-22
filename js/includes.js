document.addEventListener("DOMContentLoaded", async function () {

    /*
    ==========================================================
    DETERMINE SITE ROOT
    ==========================================================
    */

    const pathname = window.location.pathname;

    const pathParts = pathname
        .split("/")
        .filter(Boolean);


    /*
    ==========================================================
    DETERMINE CURRENT FILE + FOLDER DEPTH
    ==========================================================

    Examples:

    /index.html
    folderDepth = 0

    /immigrate/index.html
    folderDepth = 1

    /immigrate/express-entry/index.html
    folderDepth = 2

    /zh/index.html
    folderDepth = 1

    /zh/work/open/pgwp.html
    folderDepth = 3
    ==========================================================
    */


    let folderParts = [...pathParts];


    /*
    Remove current HTML file from path.
    */

    if (
        folderParts.length > 0 &&
        folderParts[folderParts.length - 1].includes(".")
    ) {

        folderParts.pop();

    }


    /*
    ==========================================================
    HANDLE LOCAL DEVELOPMENT PROJECT FOLDER
    ==========================================================
    */

    const SITE_FOLDER_NAME = "";


    if (
        SITE_FOLDER_NAME &&
        folderParts.length > 0 &&
        folderParts[0] === SITE_FOLDER_NAME
    ) {

        folderParts.shift();

    }


    /*
    ==========================================================
    DETERMINE LANGUAGE
    ==========================================================

    Any page whose first site folder is /zh/ is treated as
    a Chinese-language page.

    English:
    /index.html
    /work/open/pgwp.html

    Chinese:
    /zh/index.html
    /zh/work/open/pgwp.html
    ==========================================================
    */

    const isChinesePage =
        folderParts.length > 0 &&
        folderParts[0] === "zh";


    /*
    ==========================================================
    CALCULATE ROOT PREFIX
    ==========================================================
    */

    const folderDepth = folderParts.length;

    const is404Page =
        document.body.classList.contains("error-page");

    const rootPrefix =
        is404Page
            ? "/"
            : (
                folderDepth === 0
                    ? ""
                    : "../".repeat(folderDepth)
            );


    /*
    ==========================================================
    INCLUDE BASE PATHS
    ==========================================================

    English header/footer:
    /_includes/

    Chinese header/footer:
    /zh/_includes/

    The contact form remains the existing English shared form
    for now. It can be moved to /zh/_includes/contact-form.html
    when the Chinese form is created.
    ==========================================================
    */

    const sharedIncludePrefix =
        `${rootPrefix}_includes/`;

    const languageIncludePrefix =
        isChinesePage
            ? `${rootPrefix}zh/_includes/`
            : sharedIncludePrefix;


    /*
    ==========================================================
    CURRENT PAGE PATH
    ==========================================================
    */

    let currentPage = pathname
        .split("/")
        .filter(Boolean);


    /*
    Remove local project folder if necessary.
    */

    if (
        SITE_FOLDER_NAME &&
        currentPage[0] === SITE_FOLDER_NAME
    ) {

        currentPage.shift();

    }


    currentPage = currentPage.join("/");


    /*
    Handle homepage
    */

    if (
        currentPage === "" ||
        currentPage.endsWith("/")
    ) {

        currentPage += "index.html";

    }


    /*
    ==========================================================
    GENERIC INCLUDE LOADER
    ==========================================================
    */

    async function loadInclude(
        container,
        file,
        includePrefix = sharedIncludePrefix
    ) {

        if (!container) {
            return;
        }


        try {

            const response = await fetch(
                `${includePrefix}${file}`
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
            "header.html",
            languageIncludePrefix
        ),

        loadInclude(
            footerContainer,
            "footer.html",
            languageIncludePrefix
        ),

        loadInclude(
            contactFormContainer,
            "contact-form.html",
            sharedIncludePrefix
        )

    ]);


    /*
    ==========================================================
    FIX ROOT-BASED LINKS
    ==========================================================
    */

    document
        .querySelectorAll("[data-root-href]")
        .forEach(function (element) {

            const target =
                element.getAttribute("data-root-href");


            if (!target) {
                return;
            }


            element.setAttribute(
                "href",
                `${rootPrefix}${target}`
            );

        });


    /*
    ==========================================================
    FIX ROOT-BASED IMAGES
    ==========================================================
    */

    document
        .querySelectorAll("[data-root-src]")
        .forEach(function (element) {

            const target =
                element.getAttribute("data-root-src");


            if (!target) {
                return;
            }


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

    document
        .querySelectorAll("[data-nav-page]")
        .forEach(function (link) {

            const page =
                link.getAttribute("data-nav-page");


            if (page === currentPage) {

                if (
                    link.closest(".dropdown-menu") ||
                    link.closest(".submenu-menu")
                ) {

                    link.classList.add(
                        "active-dropdown-link"
                    );

                } else {

                    link.classList.add("active");

                }


                /*
                Highlight parent submenu
                */

                const submenu =
                    link.closest(".dropdown-submenu");


                if (submenu) {

                    const submenuTrigger =
                        submenu.querySelector(
                            ":scope > .submenu-trigger"
                        );


                    if (submenuTrigger) {

                        submenuTrigger.classList.add(
                            "active-parent-link"
                        );

                    }

                }


                /*
                Highlight main dropdown
                */

                const dropdown =
                    link.closest(".dropdown");


                if (dropdown) {

                    const dropdownToggle =
                        dropdown.querySelector(
                            ":scope > .dropdown-toggle"
                        );


                    if (dropdownToggle) {

                        dropdownToggle.classList.add(
                            "active"
                        );

                    }

                }

            }

        });


    /*
    ==========================================================
    ACTIVE SECTION NAVIGATION
    ==========================================================
    */

    document
        .querySelectorAll("[data-nav-section]")
        .forEach(function (element) {

            const section =
                element.getAttribute(
                    "data-nav-section"
                );


            if (
                section &&
                currentPage.startsWith(section)
            ) {

                element.classList.add(
                    "active"
                );

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

        if (
            currentPage === "index.html"
        ) {

            formSource.value =
                "homepage";

        } else if (
            currentPage === "zh/index.html"
        ) {

            formSource.value =
                "zh-homepage";

        } else if (
            currentPage === "contact.html"
        ) {

            formSource.value =
                "contact-page";

        } else if (
            currentPage === "zh/contact.html"
        ) {

            formSource.value =
                "zh-contact-page";

        } else {

            formSource.value =
                currentPage;

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
