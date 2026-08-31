document.addEventListener("DOMContentLoaded", function () {

    /*
     * =====================================================
     * MOBILE NAVIGATION
     * =====================================================
     */

    const menuButton =
        document.getElementById("mobileMenuButton") ||
        document.querySelector(".mobile-menu-toggle");

    const mainNav =
        document.getElementById("mainNav") ||
        document.querySelector(".main-nav");


    if (menuButton && mainNav) {

        menuButton.addEventListener("click", function () {

            const isOpen =
                mainNav.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

    }



    /*
     * =====================================================
     * MOBILE DROPDOWN MENUS
     * =====================================================
     */

    const dropdownButtons =
        document.querySelectorAll(
            ".dropdown-toggle"
        );


    dropdownButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                if (window.innerWidth <= 800) {

                    event.preventDefault();

                    const currentDropdown =
                        button.closest(".dropdown");


                    /*
                     * Close other dropdowns.
                     */

                    document
                        .querySelectorAll(".dropdown.open")
                        .forEach(function (dropdown) {

                            if (
                                dropdown !==
                                currentDropdown
                            ) {

                                dropdown
                                    .classList
                                    .remove("open");

                            }

                        });


                    currentDropdown
                        .classList
                        .toggle("open");

                }

            }
        );

    });



    /*
     * =====================================================
     * CLOSE MOBILE MENU AFTER CLICKING A NORMAL LINK
     * =====================================================
     */

    if (mainNav && menuButton) {

        mainNav
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        if (
                            window.innerWidth <= 800
                        ) {

                            mainNav
                                .classList
                                .remove("open");

                            menuButton
                                .setAttribute(
                                    "aria-expanded",
                                    "false"
                                );

                        }

                    }
                );

            });

    }



    /*
     * =====================================================
     * RESET MOBILE STATES WHEN RESIZING TO DESKTOP
     * =====================================================
     */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 800
            ) {

                if (mainNav) {

                    mainNav
                        .classList
                        .remove("open");

                }


                if (menuButton) {

                    menuButton
                        .setAttribute(
                            "aria-expanded",
                            "false"
                        );

                }


                document
                    .querySelectorAll(
                        ".dropdown.open"
                    )
                    .forEach(
                        function (dropdown) {

                            dropdown
                                .classList
                                .remove("open");

                        }
                    );

            }

        }
    );



    /*
     * =====================================================
     * TEMPORARY CONTACT FORM
     *
     * Replace this when the Cloudflare backend is ready.
     * =====================================================
     */

    const contactForm =
        document.getElementById(
            "contactForm"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                alert(
                    "Thank you for contacting AddPlus Immigration Solutions. " +
                    "The online submission system will be connected shortly."
                );

            }
        );

    }

});
