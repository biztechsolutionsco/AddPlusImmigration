(function () {

    let navigationInitialized = false;

    let contactFormInitialized = false;

    let qrModalInitialized = false;

    let serviceTabsInitialized = false;


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

            }
        );



        /*
        ======================================================
        MOBILE DROPDOWNS
        ======================================================
        */

        const dropdownToggles =
            document.querySelectorAll(
                ".dropdown-toggle"
            );


        dropdownToggles.forEach(
            function (toggle) {

                toggle.addEventListener(
                    "click",
                    function (event) {

                        if (
                            window.innerWidth > 800
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


                        document
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

                                    }

                                }
                            );


                        dropdown
                            .classList
                            .toggle(
                                "open"
                            );

                    }
                );

            }
        );



        /*
        ======================================================
        CLOSE MOBILE MENU AFTER LINK CLICK
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
                                window.innerWidth <=
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


                                document
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

                            }

                        }
                    );

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


                    document
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

                }

            }
        );

    }



    /*
    ==========================================================
    CONTACT FORM
    ==========================================================

    This is still the temporary form handler.

    Later, when the live Cloudflare form backend,
    Turnstile, and notification system are connected,
    this function will be replaced with the real
    submission process.
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
        DETERMINE ROOT PREFIX
        ======================================================
        */

        function getRootPrefix() {

            const serviceFolders = [

                "immigrate",

                "immigration",

                "sponsor",

                "work",

                "visit",

                "study",

                "others"

            ];


            const pathParts =
                window.location.pathname
                    .split("/")
                    .filter(Boolean);


            let currentFolder = "";


            if (
                pathParts.length >= 2
            ) {

                currentFolder =
                    pathParts[
                        pathParts.length -
                        2
                    ];

            }


            if (
                serviceFolders.includes(
                    currentFolder
                )
            ) {

                return "../";

            }


            return "";

        }



        /*
        ======================================================
        OPEN MODAL
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
        CLOSE MODAL
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


            /*
            Clear the image after closing so
            the previous QR code does not
            briefly appear the next time the
            modal is opened.
            */

            modalImage.src = "";


            modalImage.alt = "";


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
        BACKDROP CLICK
        ======================================================
        */

        modal
            .querySelectorAll(
                "[data-qr-close]"
            )
            .forEach(
                function (element) {

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
    */

    function initializeServiceTabs() {

        if (serviceTabsInitialized) {
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
                tabContainer.querySelectorAll(
                    "[data-service-tab]"
                )
            );


        const panels =
            Array.from(
                document.querySelectorAll(
                    "[data-service-panel]"
                )
            );


        if (
            tabs.length === 0 ||
            panels.length === 0
        ) {
            return;
        }


        serviceTabsInitialized = true;



        /*
        ======================================================
        ACTIVATE TAB
        ======================================================
        */

        function activateTab(
            selectedTab
        ) {

            const target =
                selectedTab.dataset
                    .serviceTab;


            tabs.forEach(
                function (tab) {

                    const isActive =
                        tab === selectedTab;


                    tab.classList.toggle(
                        "active",
                        isActive
                    );


                    tab.setAttribute(
                        "aria-selected",
                        String(isActive)
                    );

                }
            );


            panels.forEach(
                function (panel) {

                    const isActive =
                        panel.dataset
                            .servicePanel ===
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
        MOUSE / TOUCH
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
                        document.activeElement
                    );


                if (currentIndex === -1) {
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
                            currentIndex + 1
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

                    nextIndex = 0;

                } else if (
                    event.key ===
                    "End"
                ) {

                    nextIndex =
                        tabs.length - 1;

                } else {

                    return;

                }


                event.preventDefault();


                tabs[nextIndex]
                    .focus();


                activateTab(
                    tabs[nextIndex]
                );

            }
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

    header.html, footer.html and contact-form.html
    are loaded asynchronously through includes.js.

    Run initialization again after they exist.
    ==========================================================
    */

    document.addEventListener(
        "includesLoaded",
        initializeSite
    );

})();
