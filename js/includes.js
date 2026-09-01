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

    /immigrate/express-entry/canadian-experience-class.html
    folderDepth = 2

    /work/work-permits/open-work-permits/pgwp.html
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

    When using Live Server you may have something like:

    /addplusimmigration/index.html

    But on Cloudflare the site may be:

    /index.html

    If your local Live Server already opens directly at the
    project root, leave SITE_FOLDER_NAME empty.
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
    CURRENT PAGE PATH
    ==========================================================

    Produces:

    index.html

    immigrate/index.html

    immigrate/express-entry/index.html

    immigrate/express-entry/
    canadian-experience-class.html

    work/work-permits/
    open-work-permits/pgwp.html
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

                /*
                Exact page link
                */

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

    This allows a parent menu to stay highlighted when the
    visitor is anywhere inside that section.

    Example:

    /immigrate/express-entry/canadian-experience-class.html

    will highlight:

    IMMIGRATE
    EXPRESS ENTRY
    CANADIAN EXPERIENCE CLASS
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
            currentPage === "contact.html"
        ) {

            formSource.value =
                "contact-page";

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