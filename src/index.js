import { handleContactRequest } from "./contact-handler.js";


export default {

    async fetch(request, env) {

        const url = new URL(request.url);


        /*
        ======================================================
        CONTACT FORM API
        ======================================================
        */

        if (
            url.pathname === "/api/contact" &&
            request.method === "POST"
        ) {

            return handleContactRequest(
                request,
                env
            );

        }


        /*
        ======================================================
        EVERYTHING ELSE
        ======================================================
        */

        return new Response(
            "Not Found",
            {
                status: 404
            }
        );

    }

};