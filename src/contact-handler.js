// ==========================================================
// AddPlus Immigration Solutions
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
    form_source: 100

};


// ==========================================================
// JSON RESPONSE HELPER
// ==========================================================

function jsonResponse(data, status = 200) {

    return new Response(
        JSON.stringify(data),
        {
            status,

            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "no-store"
            }
        }
    );

}


// ==========================================================
// NORMALIZE TEXT
// ==========================================================

function normalizeText(value, maxLength) {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }


    return String(value)
        .trim()
        .slice(0, maxLength);

}


// ==========================================================
// SIMPLE EMAIL VALIDATION
// ==========================================================

function isValidEmail(email) {

    if (!email) {
        return false;
    }


    if (email.length > 254) {
        return false;
    }


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


// ==========================================================
// VALID SERVICE VALUES
// ==========================================================

const ALLOWED_SERVICES = new Set([

    "Citizenship",

    "Permanent Residence",

    "Express Entry",

    "Canadian Experience Class",

    "Federal Skilled Trades Program",

    "Federal Skilled Worker Program",

    "Provincial Nominee Program",

    "Spousal Sponsorship",

    "Same-Sex Relationship Sponsorship",

    "Common-Law Partner Sponsorship",

    "Conjugal Partner Sponsorship",

    "Family Sponsorship",

    "Dependent Child Sponsorship",

    "Parents and Grandparents Sponsorship",

    "Work Permit",

    "Extend Work Permit",

    "LMIA",

    "Super Visa",

    "Visitor Visa",

    "Extend Your Stay",

    "Study Permit",

    "Extend Study Permit",

    "Maintained Status",

    "Restoration of Temporary Status",

    "Other Immigration Matter"

]);


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

    if (request.method !== "POST") {

        return jsonResponse(
            {
                success: false,
                error: "Method not allowed."
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
        request.headers.get("Content-Type") || "";


    if (!contentType.includes("application/json")) {

        return jsonResponse(
            {
                success: false,
                error: "Invalid request format."
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

        body = await request.json();

    } catch {

        return jsonResponse(
            {
                success: false,
                error: "Invalid JSON."
            },
            400
        );

    }


    /*
    ======================================================
    NORMALIZE FIELDS
    ======================================================
    */

    const inquiry = {

        first_name: normalizeText(
            body.first_name,
            MAX_LENGTHS.first_name
        ),

        last_name: normalizeText(
            body.last_name,
            MAX_LENGTHS.last_name
        ),

        email: normalizeText(
            body.email,
            MAX_LENGTHS.email
        ).toLowerCase(),

        phone: normalizeText(
            body.phone,
            MAX_LENGTHS.phone
        ),

        citizenship: normalizeText(
            body.citizenship,
            MAX_LENGTHS.citizenship
        ),

        residence: normalizeText(
            body.residence,
            MAX_LENGTHS.residence
        ),

        service: normalizeText(
            body.service,
            MAX_LENGTHS.service
        ),

        referral: normalizeText(
            body.referral,
            MAX_LENGTHS.referral
        ),

        case_summary: normalizeText(
            body.case_summary,
            MAX_LENGTHS.case_summary
        ),

        form_source: normalizeText(
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
                field: "first_name",
                error: "First name is required."
            },
            400
        );

    }


    if (!inquiry.last_name) {

        return jsonResponse(
            {
                success: false,
                field: "last_name",
                error: "Last name is required."
            },
            400
        );

    }


    if (!isValidEmail(inquiry.email)) {

        return jsonResponse(
            {
                success: false,
                field: "email",
                error: "Please provide a valid email address."
            },
            400
        );

    }


    if (!inquiry.service) {

        return jsonResponse(
            {
                success: false,
                field: "service",
                error: "Please select a service."
            },
            400
        );

    }


    if (!ALLOWED_SERVICES.has(inquiry.service)) {

        return jsonResponse(
            {
                success: false,
                field: "service",
                error: "Invalid service selected."
            },
            400
        );

    }


    if (!inquiry.case_summary) {

        return jsonResponse(
            {
                success: false,
                field: "case_summary",
                error: "Please provide a brief summary of your situation."
            },
            400
        );

    }


    /*
    ======================================================
    MINIMUM MESSAGE LENGTH
    ======================================================

    Helps reject blank or extremely low-quality automated
    submissions even before Turnstile is added.
    ======================================================
    */

    if (inquiry.case_summary.length < 10) {

        return jsonResponse(
            {
                success: false,
                field: "case_summary",
                error: "Please provide a little more information about your situation."
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
                error: "The inquiry service is temporarily unavailable."
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

        const result = await env.DB
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
                    result.meta?.last_row_id || null
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
                error: "We were unable to save your inquiry. Please try again."
            },
            500
        );

    }

}