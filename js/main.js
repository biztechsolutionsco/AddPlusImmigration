(function () {

    let navigationInitialized = false;
    let contactFormInitialized = false;
    let qrModalInitialized = false;
    let serviceTabsInitialized = false;


    /*
    ==========================================================
    SITE PATH / ROOT HELPERS
    ==========================================================
    */

    function getPathParts() {

        return window.location.pathname
            .split("/")
            .filter(Boolean);

    }


    function getFolderDepth() {

        const pathParts = getPathParts();

        /*
        Remove current file name.

        Examples:

        /index.html
        -> []

        /family/index.html
        -> ["family"]

        /immigrate/express-entry/CEC.html
        -> ["immigrate", "express-entry"]

        /work/work-permits/open-work-permits/pgwp.html
        -> ["work", "work-permits", "open-work-permits"]
        */

        if (
            pathParts.length > 0 &&
            pathParts[pathParts.length - 1].includes(".")
        ) {

            pathParts.pop();

        }


        return pathParts.length;

    }


    function getRootPrefix() {

        const depth =
            getFolderDepth();


        if (depth === 0) {

            return "";

        }


        return "../".repeat(depth);

    }



    /*
    ==========================================================
    NAVIGATION
    ==========================================================
    */

    function initializeNavigation() {

        if (navigationInitialized) {
            return;
        }


        const mobileMenuButton =
            document.getElementById(
                "mobileMenuButton"
            ) ||
            document.querySelector(
                ".mobile-menu-toggle"
            );


        const mainNav =
            document.getElementById(
                "mainNav"
            ) ||
            document.querySelector(
                ".main-nav"
            );


        /*
        header.html may not yet be loaded.
        Do NOT set navigationInitialized until
        the required elements actually exist.
        */

        if (
            !mobileMenuButton ||
            !mainNav
        ) {

            return;

        }


        navigationInitialized = true;



        /*
        ======================================================
        MOBILE MENU BUTTON
        ======================================================
        */

        mobileMenuButton.addEventListener(
            "click",
            function () {

                const isOpen =
                    mainNav.classList.toggle(
                        "open"
                    );


                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );


                /*
                If closing the entire mobile menu,
                also close all open dropdowns.
                */

                if (!isOpen) {

                    closeAllDropdowns();

                }

            }
        );



        /*
        ======================================================
        FIRST-LEVEL MOBILE DROPDOWNS
        ======================================================

        IMMIGRATE
        FAMILY
        WORK
        STUDY
        VISIT
        STATUS & CITIZENSHIP
        ======================================================
        */

        const dropdownToggles =
            mainNav.querySelectorAll(
                ".dropdown-toggle"
            );


        dropdownToggles.forEach(
            function (toggle) {

                toggle.addEventListener(
                    "click",
                    function (event) {

                        if (
                            window.innerWidth >
                            800
                        ) {

                            return;

                        }


                        event.preventDefault();


                        const dropdown =
                            toggle.closest(
                                ".dropdown"
                            );


                        if (!dropdown) {
                            return;
                        }


                        const isAlreadyOpen =
                            dropdown.classList
                                .contains(
                                    "open"
                                );


                        /*
                        Close other first-level dropdowns.
                        */

                        mainNav
                            .querySelectorAll(
                                ".dropdown"
                            )
                            .forEach(
                                function (
                                    otherDropdown
                                ) {

                                    if (
                                        otherDropdown !==
                                        dropdown
                                    ) {

                                        otherDropdown
                                            .classList
                                            .remove(
                                                "open"
                                            );


                                        otherDropdown
                                            .querySelectorAll(
                                                ".dropdown-submenu"
                                            )
                                            .forEach(
                                                function (
                                                    submenu
                                                ) {

                                                    submenu
                                                        .classList
                                                        .remove(
                                                            "open"
                                                        );

                                                }
                                            );

                                    }

                                }
                            );


                        dropdown
                            .classList
                            .toggle(
                                "open",
                                !isAlreadyOpen
                            );

                    }
                );

            }
        );



        /*
        ======================================================
        SECOND-LEVEL / NESTED MOBILE SUBMENUS
        ======================================================

        Examples:

        FAMILY
            Spouse & Partner Sponsorship >

        IMMIGRATE
            Express Entry >

        WORK
            Open Work Permits >
        ======================================================
        */

        const submenuItems =
            mainNav.querySelectorAll(
                ".dropdown-submenu"
            );


        submenuItems.forEach(
            function (submenu) {

                const submenuLabel =
                    submenu.querySelector(
                        ":scope > .submenu-label"
                    );


                const submenuTrigger =
                    submenu.querySelector(
                        ":scope > .submenu-trigger"
                    );


                /*
                ------------------------------------------------
                NON-LINK SUBMENU LABEL
                ------------------------------------------------

                Example:

                <div class="submenu-label">
                    Spouse & Partner Sponsorship
                </div>

                Clicking it only opens the nested menu.
                */

                if (submenuLabel) {

                    submenuLabel.addEventListener(
                        "click",
                        function (event) {

                            if (
                                window.innerWidth >
                                800
                            ) {

                                return;

                            }


                            event.preventDefault();

                            event.stopPropagation();


                            toggleMobileSubmenu(
                                submenu
                            );

                        }
                    );

                }


                /*
                ------------------------------------------------
                LINKED SUBMENU TRIGGER
                ------------------------------------------------

                Example:

                <a class="submenu-trigger"
                   href="...express-entry...">

                    Express Entry >

                </a>

                On desktop:
                behaves like a normal link.

                On mobile:
                first tap opens submenu.
                second tap follows the link.
                */

                if (submenuTrigger) {

                    submenuTrigger.addEventListener(
                        "click",
                        function (event) {

                            if (
                                window.innerWidth >
                                800
                            ) {

                                return;

                            }


                            /*
                            First tap:
                            open submenu instead of navigating.
                            */

                            if (
                                !submenu.classList
                                    .contains(
                                        "open"
                                    )
                            ) {

                                event.preventDefault();

                                event.stopPropagation();


                                toggleMobileSubmenu(
                                    submenu
                                );

                            }

                            /*
                            If already open,
                            allow the normal link navigation.
                            */

                        }
                    );

                }

            }
        );



        /*
        ======================================================
        MOBILE SUBMENU HELPER
        ======================================================
        */

        function toggleMobileSubmenu(
            selectedSubmenu
        ) {

            const parentDropdown =
                selectedSubmenu.closest(
                    ".dropdown"
                );


            /*
            Close sibling submenus at the same level.
            */

            if (parentDropdown) {

                parentDropdown
                    .querySelectorAll(
                        ".dropdown-submenu"
                    )
                    .forEach(
                        function (
                            otherSubmenu
                        ) {

                            if (
                                otherSubmenu !==
                                selectedSubmenu &&
                                !otherSubmenu.contains(
                                    selectedSubmenu
                                )
                            ) {

                                otherSubmenu
                                    .classList
                                    .remove(
                                        "open"
                                    );

                            }

                        }
                    );

            }


            selectedSubmenu
                .classList
                .toggle(
                    "open"
                );

        }



        /*
        ======================================================
        CLOSE MOBILE MENU AFTER FINAL LINK CLICK
        ======================================================

        Do not close when the user merely opens
        a linked submenu on first tap.
        ======================================================
        */

        mainNav
            .querySelectorAll("a")
            .forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function () {

                            if (
                                window.innerWidth >
                                800
                            ) {

                                return;

                            }


                            /*
                            If this is a submenu trigger and
                            its submenu has just been opened,
                            keep the mobile menu open.
                            */

                            const parentSubmenu =
                                link.closest(
                                    ".dropdown-submenu"
                                );


                            if (
                                link.classList.contains(
                                    "submenu-trigger"
                                ) &&
                                parentSubmenu &&
                                parentSubmenu.classList
                                    .contains(
                                        "open"
                                    )
                            ) {

                                return;

                            }


                            closeMobileMenu();

                        }
                    );

                }
            );



        /*
        ======================================================
        CLOSE MOBILE MENU HELPER
        ======================================================
        */

        function closeMobileMenu() {

            mainNav
                .classList
                .remove(
                    "open"
                );


            mobileMenuButton
                .setAttribute(
                    "aria-expanded",
                    "false"
                );


            closeAllDropdowns();

        }



        /*
        ======================================================
        CLOSE ALL DROPDOWNS
        ======================================================
        */

        function closeAllDropdowns() {

            mainNav
                .querySelectorAll(
                    ".dropdown"
                )
                .forEach(
                    function (
                        dropdown
                    ) {

                        dropdown
                            .classList
                            .remove(
                                "open"
                            );

                    }
                );


            mainNav
                .querySelectorAll(
                    ".dropdown-submenu"
                )
                .forEach(
                    function (
                        submenu
                    ) {

                        submenu
                            .classList
                            .remove(
                                "open"
                            );

                    }
                );

        }



        /*
        ======================================================
        ESCAPE KEY
        ======================================================
        */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !==
                    "Escape"
                ) {

                    return;

                }


                if (
                    window.innerWidth <=
                    800
                ) {

                    closeMobileMenu();

                }

            }
        );



        /*
        ======================================================
        RESET MOBILE STATES ON RESIZE
        ======================================================
        */

        window.addEventListener(
            "resize",
            function () {

                if (
                    window.innerWidth >
                    800
                ) {

                    mainNav
                        .classList
                        .remove(
                            "open"
                        );


                    mobileMenuButton
                        .setAttribute(
                            "aria-expanded",
                            "false"
                        );


                    closeAllDropdowns();

                }

            }
        );

    }



    /*
    ==========================================================
    CONTACT FORM
    ==========================================================

    Temporary contact-form handler.

    Replace this later when the live Cloudflare
    backend / Turnstile / notification system
    is connected.
    ==========================================================
    */

    function initializeContactForm() {

        if (
            contactFormInitialized
        ) {

            return;

        }


        const contactForm =
            document.getElementById(
                "contactForm"
            );


        if (!contactForm) {

            return;

        }


        contactFormInitialized = true;


        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                alert(
                    "Thank you for your inquiry. " +
                    "Our online submission system " +
                    "will be connected shortly."
                );

            }
        );

    }



    /*
    ==========================================================
    SOCIAL QR CODE MODAL
    ==========================================================
    */

    function initializeQrModal() {

        if (
            qrModalInitialized
        ) {

            return;

        }


        const modal =
            document.getElementById(
                "qrModal"
            );


        if (!modal) {

            return;

        }


        const modalImage =
            document.getElementById(
                "qrModalImage"
            );


        const modalTitle =
            document.getElementById(
                "qrModalTitle"
            );


        const modalDescription =
            document.getElementById(
                "qrModalDescription"
            );


        const closeButton =
            document.getElementById(
                "qrModalClose"
            );


        const qrButtons =
            document.querySelectorAll(
                ".social-qr-button"
            );


        if (
            !modalImage ||
            !modalTitle ||
            !modalDescription ||
            !closeButton ||
            qrButtons.length === 0
        ) {

            return;

        }


        qrModalInitialized = true;


        let previouslyFocusedElement =
            null;



        /*
        ======================================================
        OPEN QR MODAL
        ======================================================
        */

        function openModal(
            button
        ) {

            previouslyFocusedElement =
                document.activeElement;


            const image =
                button.dataset.qrImage;


            const title =
                button.dataset.qrTitle ||
                "QR Code";


            const description =
                button.dataset
                    .qrDescription ||
                "";


            const rootPrefix =
                getRootPrefix();


            modalImage.src =
                `${rootPrefix}${image}`;


            modalImage.alt =
                `${title} QR code`;


            modalTitle.textContent =
                title;


            modalDescription.textContent =
                description;


            modal.classList.add(
                "open"
            );


            modal.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body
                .classList
                .add(
                    "qr-modal-open"
                );


            closeButton.focus();

        }



        /*
        ======================================================
        CLOSE QR MODAL
        ======================================================
        */

        function closeModal() {

            modal.classList.remove(
                "open"
            );


            modal.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body
                .classList
                .remove(
                    "qr-modal-open"
                );


            modalImage.src =
                "";


            modalImage.alt =
                "";


            if (
                previouslyFocusedElement &&
                typeof
                    previouslyFocusedElement
                        .focus ===
                    "function"
            ) {

                previouslyFocusedElement
                    .focus();

            }

        }



        /*
        ======================================================
        QR BUTTON EVENTS
        ======================================================
        */

        qrButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        openModal(
                            button
                        );

                    }
                );

            }
        );



        /*
        ======================================================
        CLOSE BUTTON
        ======================================================
        */

        closeButton.addEventListener(
            "click",
            closeModal
        );



        /*
        ======================================================
        BACKDROP / OTHER CLOSE CONTROLS
        ======================================================
        */

        modal
            .querySelectorAll(
                "[data-qr-close]"
            )
            .forEach(
                function (
                    element
                ) {

                    element.addEventListener(
                        "click",
                        closeModal
                    );

                }
            );



        /*
        ======================================================
        ESCAPE KEY
        ======================================================
        */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                        "Escape" &&
                    modal.classList
                        .contains(
                            "open"
                        )
                ) {

                    closeModal();

                }

            }
        );

    }



    /*
    ==========================================================
    HOMEPAGE SERVICE TABS
    ==========================================================

    Completely generic.

    It does NOT care whether your categories are:

    immigration
    family
    work
    study
    visit
    status-citizenship

    It simply matches:

    data-service-tab="xxxxx"

    with

    data-service-panel="xxxxx"
    ==========================================================
    */

    function initializeServiceTabs() {

        if (
            serviceTabsInitialized
        ) {

            return;

        }


        const tabContainer =
            document.querySelector(
                ".service-tabs"
            );


        if (!tabContainer) {

            return;

        }


        const tabs =
            Array.from(
                tabContainer
                    .querySelectorAll(
                        "[data-service-tab]"
                    )
            );


        const panels =
            Array.from(
                document
                    .querySelectorAll(
                        "[data-service-panel]"
                    )
            );


        if (
            tabs.length === 0 ||
            panels.length === 0
        ) {

            return;

        }


        serviceTabsInitialized =
            true;



        /*
        ======================================================
        ACTIVATE TAB
        ======================================================
        */

        function activateTab(
            selectedTab
        ) {

            const target =
                selectedTab.getAttribute(
                    "data-service-tab"
                );


            /*
            Update every tab.
            */

            tabs.forEach(
                function (tab) {

                    const isActive =
                        tab ===
                        selectedTab;


                    tab.classList.toggle(
                        "active",
                        isActive
                    );


                    tab.setAttribute(
                        "aria-selected",
                        String(isActive)
                    );


                    tab.setAttribute(
                        "tabindex",
                        isActive
                            ? "0"
                            : "-1"
                    );

                }
            );


            /*
            Show matching panel.
            Hide every other panel.
            */

            panels.forEach(
                function (panel) {

                    const panelTarget =
                        panel.getAttribute(
                            "data-service-panel"
                        );


                    const isActive =
                        panelTarget ===
                        target;


                    panel.hidden =
                        !isActive;


                    panel.classList.toggle(
                        "active",
                        isActive
                    );

                }
            );

        }



        /*
        ======================================================
        CLICK / TOUCH
        ======================================================
        */

        tabs.forEach(
            function (tab) {

                tab.addEventListener(
                    "click",
                    function () {

                        activateTab(
                            tab
                        );

                    }
                );

            }
        );



        /*
        ======================================================
        KEYBOARD NAVIGATION
        ======================================================
        */

        tabContainer.addEventListener(
            "keydown",
            function (event) {

                const currentIndex =
                    tabs.indexOf(
                        document
                            .activeElement
                    );


                if (
                    currentIndex ===
                    -1
                ) {

                    return;

                }


                let nextIndex =
                    currentIndex;


                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    nextIndex =
                        (
                            currentIndex +
                            1
                        ) %
                        tabs.length;

                } else if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    nextIndex =
                        (
                            currentIndex -
                            1 +
                            tabs.length
                        ) %
                        tabs.length;

                } else if (
                    event.key ===
                    "Home"
                ) {

                    nextIndex =
                        0;

                } else if (
                    event.key ===
                    "End"
                ) {

                    nextIndex =
                        tabs.length -
                        1;

                } else {

                    return;

                }


                event.preventDefault();


                tabs[
                    nextIndex
                ].focus();


                activateTab(
                    tabs[
                        nextIndex
                    ]
                );

            }
        );



        /*
        ======================================================
        INITIAL TAB
        ======================================================

        Find the tab already marked active.

        If none exists, use the first tab.
        ======================================================
        */

        const initialTab =
            tabs.find(
                function (tab) {

                    return tab
                        .classList
                        .contains(
                            "active"
                        );

                }
            ) ||
            tabs[0];


        activateTab(
            initialTab
        );

    }



    /*
    ==========================================================
    INITIALIZE SITE
    ==========================================================
    */

    function initializeSite() {

        initializeNavigation();

        initializeContactForm();

        initializeQrModal();

        initializeServiceTabs();

    }



    /*
    ==========================================================
    NORMAL DOM READY
    ==========================================================
    */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeSite
        );

    } else {

        initializeSite();

    }



    /*
    ==========================================================
    SHARED INCLUDES READY
    ==========================================================

    header.html,
    footer.html,
    contact-form.html

    are loaded asynchronously through includes.js.

    Run initialization again once they exist.
    ==========================================================
    */

    document.addEventListener(
        "includesLoaded",
        initializeSite
    );

})();
