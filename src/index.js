import { handleContactRequest } from "./contact-handler.js";


const ALLOWED_ORIGINS = new Set([
    "https://addplus.ca",
    "https://www.addplus.ca",

    // Temporary GitHub Pages address for testing.
    "https://biztechsolutionsco.github.io"
]);


function getCorsHeaders(origin) {

    if (
        !origin ||
        !ALLOWED_ORIGINS.has(origin)
    ) {
        return {};
    }


    return {
        "Access-Control-Allow-Origin":
            origin,

        "Access-Control-Allow-Methods":
            "POST, OPTIONS",

        "Access-Control-Allow-Headers":
            "Content-Type",

        "Access-Control-Max-Age":
            "86400",

        "Vary":
            "Origin"
    };

}


function addCorsHeaders(
    response,
    origin
) {

    const headers =
        new Headers(
            response.headers
        );


    const corsHeaders =
        getCorsHeaders(origin);


    Object.entries(
        corsHeaders
    ).forEach(
        function ([key, value]) {

            headers.set(
                key,
                value
            );

        }
    );


    return new Response(
        response.body,
        {
            status:
                response.status,

            statusText:
                response.statusText,

            headers
        }
    );

}


export default {

    async fetch(request, env) {

        const url =
            new URL(
                request.url
            );


        /*
        ======================================================
        CONTACT API
        ======================================================
        */

        if (
            url.pathname ===
            "/api/contact"
        ) {

            const origin =
                request.headers.get(
                    "Origin"
                ) || "";


            /*
            ==================================================
            CORS ORIGIN CHECK
            ==================================================
            */

            if (
                origin &&
                !ALLOWED_ORIGINS.has(
                    origin
                )
            ) {

                return new Response(
                    "Forbidden",
                    {
                        status: 403
                    }
                );

            }


            /*
            ==================================================
            PREFLIGHT REQUEST
            ==================================================
            */

            if (
                request.method ===
                "OPTIONS"
            ) {

                return new Response(
                    null,
                    {
                        status: 204,
                        headers:
                            getCorsHeaders(
                                origin
                            )
                    }
                );

            }


            /*
            ==================================================
            CONTACT FORM POST
            ==================================================
            */

            if (
                request.method ===
                "POST"
            ) {

                const response =
                    await handleContactRequest(
                        request,
                        env
                    );


                return addCorsHeaders(
                    response,
                    origin
                );

            }


            return new Response(
                "Method Not Allowed",
                {
                    status: 405,
                    headers:
                        getCorsHeaders(
                            origin
                        )
                }
            );

        }


        return new Response(
            "Not Found",
            {
                status: 404
            }
        );

    }

};