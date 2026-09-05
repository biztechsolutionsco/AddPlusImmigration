(function () {

    /*
    ==========================================================
    INITIALIZATION FLAGS
    ==========================================================
    */

    let navigationInitialized = false;

    let contactFormInitialized = false;

    let qrModalInitialized = false;

    let serviceTabsInitialized = false;

    let servicesAccordionInitialized = false;

    let turnstileInitialized = false;

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
            );


        const mainNav =
            document.getElementById(
                "mainNav"
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
        MOBILE MENU
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
        FIRST-LEVEL MOBILE DROPDOWNS
        ======================================================
        */

        const dropdowns =
            Array.from(
                mainNav.querySelectorAll(
                    ".dropdown"
                )
            );


        dropdowns.forEach(
            function (dropdown) {

                const toggle =
                    dropdown.querySelector(
                        ":scope > .dropdown-toggle"
                    );


                if (!toggle) {
                    return;
                }


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


                        const wasOpen =
                            dropdown.classList.contains(
                                "open"
                            );


                        /*
                        Close other first-level menus.
                        */

                        dropdowns.forEach(
                            function (otherDropdown) {

                                if (
                                    otherDropdown !==
                                    dropdown
                                ) {

                                    otherDropdown
                                        .classList
                                        .remove(
                                            "open"
                                        );


                                    const otherToggle =
                                        otherDropdown
                                            .querySelector(
                                                ":scope > .dropdown-toggle"
                                            );


                                    if (otherToggle) {

                                        otherToggle
                                            .setAttribute(
                                                "aria-expanded",
                                                "false"
                                            );

                                    }

                                }

                            }
                        );


                        dropdown.classList.toggle(
                            "open",
                            !wasOpen
                        );


                        toggle.setAttribute(
                            "aria-expanded",
                            String(!wasOpen)
                        );

                    }
                );

            }
        );



        /*
        ======================================================
        SECOND-LEVEL MOBILE SUBMENUS
        ======================================================
        */

        const submenus =
            Array.from(
                mainNav.querySelectorAll(
                    ".dropdown-submenu"
                )
            );


        submenus.forEach(
            function (submenu) {

                const trigger =
                    submenu.querySelector(
                        ":scope > .submenu-trigger, :scope > .submenu-label"
                    );


                if (!trigger) {
                    return;
                }


                trigger.addEventListener(
                    "click",
                    function (event) {

                        if (
                            window.innerWidth >
                            800
                        ) {
                            return;
                        }


                        event.preventDefault();


                        const wasOpen =
                            submenu.classList.contains(
                                "open"
                            );


                        const siblingSubmenus =
                            submenu
                                .parentElement
                                .querySelectorAll(
                                    ":scope > .dropdown-submenu"
                                );


                        siblingSubmenus.forEach(
                            function (
                                otherSubmenu
                            ) {

                                if (
                                    otherSubmenu !==
                                    submenu
                                ) {

                                    otherSubmenu
                                        .classList
                                        .remove(
                                            "open"
                                        );

                                }

                            }
                        );


                        submenu.classList.toggle(
                            "open",
                            !wasOpen
                        );

                    }
                );

            }
        );



        /*
        ======================================================
        CLOSE MOBILE NAV AFTER LINK CLICK
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


                            mainNav.classList.remove(
                                "open"
                            );


                            mobileMenuButton
                                .setAttribute(
                                    "aria-expanded",
                                    "false"
                                );

                        }
                    );

                }
            );



        /*
        ======================================================
        RESET MOBILE MENU WHEN RETURNING TO DESKTOP
        ======================================================
        */

        window.addEventListener(
            "resize",
            function () {

                if (
                    window.innerWidth >
                    800
                ) {

                    mainNav.classList.remove(
                        "open"
                    );


                    mobileMenuButton
                        .setAttribute(
                            "aria-expanded",
                            "false"
                        );


                    dropdowns.forEach(
                        function (dropdown) {

                            dropdown
                                .classList
                                .remove(
                                    "open"
                                );

                        }
                    );


                    submenus.forEach(
                        function (submenu) {

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

    }

    /*
    ==========================================================
    CONTACT FORM
    ==========================================================
    */

    function initializeContactForm() {

        if (contactFormInitialized) {
            return;
        }


        const form =
            document.getElementById(
                "contactForm"
            );


        if (!form) {
            return;
        }


        const message =
            document.getElementById(
                "formMessage"
            );


        const submitButton =
            form.querySelector(
                'button[type="submit"]'
            );


        const formSource =
            document.getElementById(
                "formSource"
            );


        /*
        Record the page from which the inquiry
        was submitted.

        Examples:
        /
        /work/open/pgwp
        /family/spouse/spousal-sponsorship
        */

        if (formSource) {

            formSource.value =
                window.location.pathname ||
                "/";

        }


        contactFormInitialized = true;



        /*
        ======================================================
        MESSAGE HELPER
        ======================================================
        */

        function showFormMessage(
            text,
            type = ""
        ) {

            if (!message) {
                return;
            }


            message.textContent =
                text;


            message.classList.remove(
                "success",
                "error"
            );


            if (type) {

                message.classList.add(
                    type
                );

            }

        }



        /*
        ======================================================
        SUBMIT BUTTON STATE
        ======================================================
        */

        function setSubmitting(
            isSubmitting
        ) {

            if (!submitButton) {
                return;
            }


            submitButton.disabled =
                isSubmitting;


            submitButton.setAttribute(
                "aria-busy",
                String(isSubmitting)
            );


            submitButton.textContent =
                isSubmitting
                    ? "Submitting..."
                    : "Submit Inquiry";

        }



        /*
        ======================================================
        FORM SUBMISSION
        ======================================================
        */

        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                showFormMessage("");


                /*
                Use the browser's built-in field validation
                even though the form itself uses novalidate.
                */

                if (!form.checkValidity()) {

                    form.reportValidity();

                    showFormMessage(
                        "Please complete all required fields and check that your information is entered correctly.",
                        "error"
                    );

                    return;

                }


                /*
                Basic honeypot protection.

                The server will perform this check again.
                */

                const honeypot =
                    form.elements.website;


                if (
                    honeypot &&
                    honeypot.value.trim() !== ""
                ) {

                    /*
                    Do not give automated submissions useful
                    information about why they were rejected.
                    */

                    form.reset();


                    if (formSource) {

                        formSource.value =
                            window.location.pathname ||
                            "/";

                    }


                    showFormMessage(
                        "Thank you. Your inquiry has been received.",
                        "success"
                    );

                    return;

                }


                /*
                Cloudflare Turnstile automatically adds
                cf-turnstile-response to the form.
                */

                const formData =
                    new FormData(
                        form
                    );


                const payload =
                    Object.fromEntries(
                        formData.entries()
                    );


                /*
                Trim string values before sending.
                */

                Object.keys(payload)
                    .forEach(
                        function (key) {

                            if (
                                typeof payload[key] ===
                                "string"
                            ) {

                                payload[key] =
                                    payload[key]
                                        .trim();

                            }

                        }
                    );


                setSubmitting(true);


                try {

                    const response =
                        await fetch(
                            "https://addplusimmigration.biztechsolutionsco.workers.dev/api/contact",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        payload
                                    )
                            }
                        );


                    let result = null;


                    try {

                        result =
                            await response.json();

                    } catch (error) {

                        result = null;

                    }


                    if (!response.ok) {

                        throw new Error(
                            result &&
                            result.message
                                ? result.message
                                : "Unable to submit inquiry."
                        );

                    }


                    form.reset();


                    /*
                    Restore the page source because reset()
                    returns the hidden field to its original
                    HTML value of "website".
                    */

                    if (formSource) {

                        formSource.value =
                            window.location.pathname ||
                            "/";

                    }


                    showFormMessage(
                        "Thank you for contacting AddPlus Immigration Solutions Inc. Your inquiry has been received and our team will respond as soon as possible.",
                        "success"
                    );


                } catch (error) {

                    console.error(
                        "Contact form submission failed:",
                        error
                    );


                    showFormMessage(
                        "We were unable to submit your inquiry. Please try again. If the problem continues, please contact us by email.",
                        "error"
                    );


                } finally {

                    setSubmitting(false);

                }

            }
        );

    }

    /*
    ==========================================================
    CLOUDFLARE TURNSTILE
    ==========================================================
    */

    function initializeTurnstile() {

        if (turnstileInitialized) {
            return;
        }


        const container =
            document.getElementById(
                "turnstileContainer"
            );


        if (!container) {
            return;
        }


        const sitekey =
            container.dataset.sitekey;


        if (!sitekey) {
            return;
        }


        turnstileInitialized = true;



        /*
        ======================================================
        RENDER WIDGET
        ======================================================
        */

        function renderTurnstile() {

            if (
                !window.turnstile ||
                container.dataset
                    .turnstileRendered ===
                    "true"
            ) {
                return;
            }


            window.turnstile.render(
                container,
                {
                    sitekey: sitekey,

                    theme: "auto",

                    action:
                        "contact_form",

                    callback:
                        function () {

                            const message =
                                document.getElementById(
                                    "formMessage"
                                );


                            if (
                                message &&
                                message.classList
                                    .contains(
                                        "error"
                                    )
                            ) {

                                message.textContent =
                                    "";

                                message.classList
                                    .remove(
                                        "error"
                                    );

                            }

                        },

                    "expired-callback":
                        function () {

                            const message =
                                document.getElementById(
                                    "formMessage"
                                );


                            if (message) {

                                message.textContent =
                                    "The security verification expired. Please complete it again before submitting.";

                                message.classList
                                    .remove(
                                        "success"
                                    );

                                message.classList
                                    .add(
                                        "error"
                                    );

                            }

                        },

                    "error-callback":
                        function () {

                            const message =
                                document.getElementById(
                                    "formMessage"
                                );


                            if (message) {

                                message.textContent =
                                    "We could not load the security verification. Please refresh the page and try again.";

                                message.classList
                                    .remove(
                                        "success"
                                    );

                                message.classList
                                    .add(
                                        "error"
                                    );

                            }

                        }
                }
            );


            container.dataset
                .turnstileRendered =
                "true";

        }



        /*
        ======================================================
        LOAD TURNSTILE SCRIPT
        ======================================================
        */

        if (window.turnstile) {

            renderTurnstile();

            return;

        }


        const existingScript =
            document.querySelector(
                'script[data-turnstile-script]'
            );


        if (existingScript) {

            existingScript.addEventListener(
                "load",
                renderTurnstile,
                {
                    once: true
                }
            );

            return;

        }


        const script =
            document.createElement(
                "script"
            );


        script.src =
            "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";


        script.async = true;

        script.defer = true;

        script.dataset.turnstileScript =
            "true";


        script.addEventListener(
            "load",
            renderTurnstile,
            {
                once: true
            }
        );


        script.addEventListener(
            "error",
            function () {

                turnstileInitialized =
                    false;


                console.error(
                    "Unable to load Cloudflare Turnstile."
                );

            },
            {
                once: true
            }
        );


        document.head.appendChild(
            script
        );

    }
    /*
    ==========================================================
    QR CODE MODAL
    ==========================================================
    */

    function initializeQrModal() {

        if (qrModalInitialized) {
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
            Array.from(
                document.querySelectorAll(
                    ".social-qr-button"
                )
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

        const pathParts =
            window.location.pathname
                .split("/")
                .filter(Boolean);


        const rootFolders = [
            "immigrate",
            "family",
            "work",
            "study",
            "visit",
            "status"
        ];


        let depth = 0;


        for (
            let index = 0;
            index < pathParts.length - 1;
            index++
        ) {

            if (
                rootFolders.includes(
                    pathParts[index]
                )
            ) {

                depth =
                    pathParts.length - 1;

                break;

            }

        }


        const rootPrefix =
            depth > 0
                ? "../".repeat(depth)
                : "";



        /*
        ======================================================
        OPEN MODAL
        ======================================================
        */

        function openQrModal(
            button
        ) {

            const image =
                button.dataset
                    .qrImage;


            const title =
                button.dataset
                    .qrTitle ||
                "Connect With Us";


            const description =
                button.dataset
                    .qrDescription ||
                "";


            if (!image) {
                return;
            }


            previouslyFocusedElement =
                document.activeElement;


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
                .classList.add(
                    "qr-modal-open"
                );


            closeButton.focus();

        }



        /*
        ======================================================
        CLOSE MODAL
        ======================================================
        */

        function closeQrModal() {

            modal.classList.remove(
                "open"
            );


            modal.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body
                .classList.remove(
                    "qr-modal-open"
                );


            modalImage.src =
                "";


            if (
                previouslyFocusedElement &&
                typeof previouslyFocusedElement
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

                        openQrModal(
                            button
                        );

                    }
                );

            }
        );


        closeButton.addEventListener(
            "click",
            closeQrModal
        );


        modal
            .querySelectorAll(
                "[data-qr-close]"
            )
            .forEach(
                function (element) {

                    element.addEventListener(
                        "click",
                        closeQrModal
                    );

                }
            );


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

                    closeQrModal();

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


        serviceTabsInitialized =
            true;



        /*
        ======================================================
        ACTIVATE A TAB
        ======================================================
        */

        function activateTab(
            selectedTab
        ) {

            const target =
                selectedTab
                    .dataset
                    .serviceTab;


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
                        String(
                            isActive
                        )
                    );


                    tab.tabIndex =
                        isActive
                            ? 0
                            : -1;

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
        CLICK
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
        KEYBOARD
        ======================================================
        */

        tabContainer.addEventListener(
            "keydown",
            function (event) {

                const currentIndex =
                    tabs.indexOf(
                        document.activeElement
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


                tabs[nextIndex]
                    .focus();


                activateTab(
                    tabs[nextIndex]
                );

            }
        );


        /*
        Ensure initial tabindex is correct.
        */

        tabs.forEach(
            function (tab) {

                tab.tabIndex =
                    tab.classList
                        .contains(
                            "active"
                        )
                        ? 0
                        : -1;

            }
        );

    }



    /*
    ==========================================================
    ALL SERVICES ACCORDION
    ==========================================================
    */

    function initializeServicesAccordion() {

        if (
            servicesAccordionInitialized
        ) {
            return;
        }


        const accordion =
            document.querySelector(
                ".services-accordion"
            );


        if (!accordion) {
            return;
        }


        const items =
            Array.from(
                accordion.querySelectorAll(
                    ".services-accordion-item"
                )
            );


        if (
            items.length ===
            0
        ) {
            return;
        }


        servicesAccordionInitialized =
            true;



        /*
        ======================================================
        SET ITEM STATE
        ======================================================
        */

        function setAccordionItemState(
            item,
            open
        ) {

            const trigger =
                item.querySelector(
                    ".services-accordion-trigger"
                );


            const content =
                item.querySelector(
                    ".services-accordion-content"
                );


            const symbol =
                item.querySelector(
                    ".services-accordion-symbol"
                );


            if (
                !trigger ||
                !content
            ) {
                return;
            }


            item.classList.toggle(
                "open",
                open
            );


            trigger.setAttribute(
                "aria-expanded",
                String(open)
            );


            content.hidden =
                !open;


            if (symbol) {

                symbol.textContent =
                    open
                        ? "−"
                        : "+";

            }

        }



        /*
        ======================================================
        NORMALIZE INITIAL STATE

        If HTML marks one item .open, keep it.
        If none are marked open, open the first category.
        ======================================================
        */

        let initialOpenItem =
            items.find(
                function (item) {

                    return item
                        .classList
                        .contains(
                            "open"
                        );

                }
            );


        if (!initialOpenItem) {

            initialOpenItem =
                items[0];

        }


        items.forEach(
            function (item) {

                setAccordionItemState(
                    item,
                    item ===
                        initialOpenItem
                );

            }
        );



        /*
        ======================================================
        ACCORDION EVENTS
        ======================================================
        */

        items.forEach(
            function (item) {

                const trigger =
                    item.querySelector(
                        ".services-accordion-trigger"
                    );


                if (!trigger) {
                    return;
                }


                trigger.addEventListener(
                    "click",
                    function () {

                        const isOpen =
                            item
                                .classList
                                .contains(
                                    "open"
                                );


                        /*
                        Close every category.
                        */

                        items.forEach(
                            function (
                                otherItem
                            ) {

                                setAccordionItemState(
                                    otherItem,
                                    false
                                );

                            }
                        );


                        /*
                        If the selected category was closed,
                        open it.

                        If it was already open, leave all
                        categories closed.
                        */

                        if (!isOpen) {

                            setAccordionItemState(
                                item,
                                true
                            );

                        }

                    }
                );

            }
        );

    }



    /*
    ==========================================================
    INITIALIZE SITE FEATURES
    ==========================================================
    */

    function initializeSite() {

        initializeNavigation();

        initializeContactForm();

        initializeTurnstile();

        initializeQrModal();

        initializeServiceTabs();

        initializeServicesAccordion();

    }

    /*
    ==========================================================
    INITIAL PAGE LOAD

    Some features exist directly in the page.
    Header/footer/form features are loaded later through
    includes.js, so initialize both before and after the
    custom includesLoaded event.
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


    document.addEventListener(
        "includesLoaded",
        initializeSite
    );

})();
