// ==========================================================
// AddPlus Immigration Solutions Inc.
// Contact Form API Handler
// ==========================================================

const MAX_LENGTHS = {
    first_name: 100,
    last_name: 100,
    email: 254,
    phone: 50,
    citizenship: 100,
    residence: 100,
    service: 150,
    referral: 150,
    case_summary: 5000,
    form_source: 255,
    website: 200
};


// ==========================================================
// VALID SERVICE VALUES
// ==========================================================

const ALLOWED_SERVICES = new Set([
    "Permanent Residence",
    "Canadian Experience Class",
    "Federal Skilled Worker Program",
    "Federal Skilled Trades Program",
    "Provincial Nominee Program",

    "Spousal Sponsorship",
    "Common-Law Partner Sponsorship",
    "Conjugal Partner Sponsorship",
    "Same-Sex Sponsorship",
    "Dependent Child Sponsorship",
    "Parents and Grandparents Sponsorship",
    "Super Visa",

    "Work Permit",
    "Spousal Open Work Permit",
    "Post-Graduation Work Permit",
    "Bridging Open Work Permit",
    "Vulnerable Worker Open Work Permit",
    "Extend or Change Work Permit",
    "LMIA for Employers",
    "LMIA-Based Work Permit",

    "Study Permit",
    "Study Permit Extension",

    "Visitor Visa",
    "Extend Your Stay",

    "Maintained Status",
    "Restoration of Temporary Status",
    "PR Card Renewal or Replacement",
    "Permanent Resident Travel Document",
    "Canadian Citizenship",

    "Other Immigration Matter"
]);


// ==========================================================
// VALID REFERRAL VALUES
// ==========================================================

const ALLOWED_REFERRALS = new Set([
    "",
    "Friend or Family",
    "Google Search",
    "WeChat",
    "Xiaohongshu",
    "Social Media",
    "Previous Client",
    "Other"
]);


// ==========================================================
// ALLOWED TURNSTILE HOSTNAMES
// ==========================================================

const ALLOWED_TURNSTILE_HOSTNAMES = new Set([
    "addplusimmigration.biztechsolutionsco.workers.dev",
    "addplus.ca",
    "www.addplus.ca",
    "biztechsolutionsco.github.io"
]);


// ==========================================================
// JSON RESPONSE HELPER
// ==========================================================

function jsonResponse(data, status = 200) {

    return new Response(
        JSON.stringify(data),
        {
            status,

            headers: {
                "Content-Type":
                    "application/json; charset=utf-8",

                "Cache-Control":
                    "no-store"
            }
        }
    );

}


// ==========================================================
// NORMALIZE TEXT
// ==========================================================

function normalizeText(
    value,
    maxLength
) {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }


    return String(value)
        .trim()
        .slice(
            0,
            maxLength
        );

}


// ==========================================================
// SIMPLE EMAIL VALIDATION
// ==========================================================

function isValidEmail(email) {

    if (!email) {
        return false;
    }


    if (
        email.length >
        MAX_LENGTHS.email
    ) {
        return false;
    }


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


// ==========================================================
// VERIFY CLOUDFLARE TURNSTILE
// ==========================================================

async function verifyTurnstile(
    token,
    request,
    env
) {

    if (
        !env.TURNSTILE_SECRET_KEY
    ) {

        console.error(
            "TURNSTILE_SECRET_KEY is not configured."
        );

        return {
            success: false
        };

    }


    if (
        !token ||
        typeof token !== "string" ||
        token.length > 2048
    ) {

        return {
            success: false
        };

    }


    const remoteIp =
        request.headers.get(
            "CF-Connecting-IP"
        ) || "";


    try {

        const response =
            await fetch(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            secret:
                                env.TURNSTILE_SECRET_KEY,

                            response:
                                token,

                            remoteip:
                                remoteIp
                        })
                }
            );


        if (!response.ok) {

            console.error(
                "Turnstile Siteverify returned:",
                response.status
            );


            return {
                success: false
            };

        }


        const result =
            await response.json();


        return result;


    } catch (error) {

        console.error(
            "Turnstile verification failed:",
            error
        );


        return {
            success: false
        };

    }

}


// ==========================================================
// MAIN CONTACT HANDLER
// ==========================================================

export async function handleContactRequest(
    request,
    env
) {

    /*
    ======================================================
    METHOD CHECK
    ======================================================
    */

    if (
        request.method !==
        "POST"
    ) {

        return jsonResponse(
            {
                success: false,
                message:
                    "Method not allowed."
            },
            405
        );

    }


    /*
    ======================================================
    CONTENT TYPE
    ======================================================
    */

    const contentType =
        request.headers.get(
            "Content-Type"
        ) || "";


    if (
        !contentType.includes(
            "application/json"
        )
    ) {

        return jsonResponse(
            {
                success: false,
                message:
                    "Invalid request format."
            },
            415
        );

    }


    /*
    ======================================================
    PARSE REQUEST
    ======================================================
    */

    let body;


    try {

        body =
            await request.json();

    } catch {

        return jsonResponse(
            {
                success: false,
                message:
                    "Invalid JSON."
            },
            400
        );

    }


    if (
        !body ||
        typeof body !==
            "object" ||
        Array.isArray(body)
    ) {

        return jsonResponse(
            {
                success: false,
                message:
                    "Invalid request."
            },
            400
        );

    }


    /*
    ======================================================
    HONEYPOT

    Legitimate users never fill this field.
    Return a normal-looking success response so bots
    are not told how the spam filter works.
    ======================================================
    */

    const website =
        normalizeText(
            body.website,
            MAX_LENGTHS.website
        );


    if (website) {

        return jsonResponse(
            {
                success: true,
                message:
                    "Your inquiry has been received."
            },
            200
        );

    }


    /*
    ======================================================
    CLOUDFLARE TURNSTILE VERIFICATION
    ======================================================
    */

    const turnstileToken =
        normalizeText(
            body["cf-turnstile-response"],
            2048
        );


    if (!turnstileToken) {

        return jsonResponse(
            {
                success: false,
                message:
                    "Please complete the security verification."
            },
            400
        );

    }


    const turnstileResult =
        await verifyTurnstile(
            turnstileToken,
            request,
            env
        );


    if (
        !turnstileResult.success
    ) {

        return jsonResponse(
            {
                success: false,
                message:
                    "Security verification failed. Please refresh the page and try again."
            },
            403
        );

    }


    /*
    Make sure the token was issued specifically
    for the contact form.
    */

    if (
        turnstileResult.action !==
        "contact_form"
    ) {

        console.error(
            "Unexpected Turnstile action:",
            turnstileResult.action
        );


        return jsonResponse(
            {
                success: false,
                message:
                    "Security verification failed. Please refresh the page and try again."
            },
            403
        );

    }


    /*
    Make sure the token was generated on an
    approved AddPlus hostname.
    */

    if (
        !ALLOWED_TURNSTILE_HOSTNAMES.has(
            turnstileResult.hostname
        )
    ) {

        console.error(
            "Unexpected Turnstile hostname:",
            turnstileResult.hostname
        );


        return jsonResponse(
            {
                success: false,
                message:
                    "Security verification failed. Please refresh the page and try again."
            },
            403
        );

    }


    /*
    ======================================================
    NORMALIZE FIELDS
    ======================================================
    */

    const inquiry = {

        first_name:
            normalizeText(
                body.first_name,
                MAX_LENGTHS.first_name
            ),

        last_name:
            normalizeText(
                body.last_name,
                MAX_LENGTHS.last_name
            ),

        email:
            normalizeText(
                body.email,
                MAX_LENGTHS.email
            ).toLowerCase(),

        phone:
            normalizeText(
                body.phone,
                MAX_LENGTHS.phone
            ),

        citizenship:
            normalizeText(
                body.citizenship,
                MAX_LENGTHS.citizenship
            ),

        residence:
            normalizeText(
                body.residence,
                MAX_LENGTHS.residence
            ),

        service:
            normalizeText(
                body.service,
                MAX_LENGTHS.service
            ),

        referral:
            normalizeText(
                body.referral,
                MAX_LENGTHS.referral
            ),

        case_summary:
            normalizeText(
                body.case_summary,
                MAX_LENGTHS.case_summary
            ),

        form_source:
            normalizeText(
                body.form_source,
                MAX_LENGTHS.form_source
            ) || "website"

    };


    /*
    ======================================================
    REQUIRED FIELDS
    ======================================================
    */

    if (!inquiry.first_name) {

        return jsonResponse(
            {
                success: false,
                field:
                    "first_name",
                message:
                    "First name is required."
            },
            400
        );

    }


    if (!inquiry.last_name) {

        return jsonResponse(
            {
                success: false,
                field:
                    "last_name",
                message:
                    "Last name is required."
            },
            400
        );

    }


    if (
        !isValidEmail(
            inquiry.email
        )
    ) {

        return jsonResponse(
            {
                success: false,
                field:
                    "email",
                message:
                    "Please provide a valid email address."
            },
            400
        );

    }


    if (!inquiry.service) {

        return jsonResponse(
            {
                success: false,
                field:
                    "service",
                message:
                    "Please select a service."
            },
            400
        );

    }


    if (
        !ALLOWED_SERVICES.has(
            inquiry.service
        )
    ) {

        return jsonResponse(
            {
                success: false,
                field:
                    "service",
                message:
                    "Invalid service selected."
            },
            400
        );

    }


    if (
        !ALLOWED_REFERRALS.has(
            inquiry.referral
        )
    ) {

        return jsonResponse(
            {
                success: false,
                field:
                    "referral",
                message:
                    "Invalid referral source."
            },
            400
        );

    }


    if (!inquiry.case_summary) {

        return jsonResponse(
            {
                success: false,
                field:
                    "case_summary",
                message:
                    "Please provide a brief summary of your situation."
            },
            400
        );

    }


    /*
    ======================================================
    MINIMUM CASE SUMMARY LENGTH
    ======================================================
    */

    if (
        inquiry.case_summary.length <
        10
    ) {

        return jsonResponse(
            {
                success: false,
                field:
                    "case_summary",
                message:
                    "Please provide a little more information about your situation."
            },
            400
        );

    }


    /*
    ======================================================
    D1 BINDING CHECK
    ======================================================
    */

    if (!env.DB) {

        console.error(
            "D1 binding 'DB' is not configured."
        );


        return jsonResponse(
            {
                success: false,
                message:
                    "The inquiry service is temporarily unavailable."
            },
            500
        );

    }


    /*
    ======================================================
    INSERT INTO D1
    ======================================================
    */

    try {

        const result =
            await env.DB
                .prepare(`
                    INSERT INTO inquiries (
                        first_name,
                        last_name,
                        email,
                        phone,
                        citizenship,
                        residence,
                        service,
                        referral,
                        case_summary,
                        form_source,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
                `)
                .bind(
                    inquiry.first_name,
                    inquiry.last_name,
                    inquiry.email,
                    inquiry.phone || null,
                    inquiry.citizenship || null,
                    inquiry.residence || null,
                    inquiry.service,
                    inquiry.referral || null,
                    inquiry.case_summary,
                    inquiry.form_source
                )
                .run();


        /*
        ==================================================
        SUCCESS
        ==================================================
        */

        return jsonResponse(
            {
                success: true,

                inquiry_id:
                    result.meta
                        ?.last_row_id ||
                    null,

                message:
                    "Your inquiry has been received."
            },
            201
        );


    } catch (error) {

        console.error(
            "Unable to save inquiry:",
            error
        );


        return jsonResponse(
            {
                success: false,
                message:
                    "We were unable to save your inquiry. Please try again."
            },
            500
        );

    }

}
