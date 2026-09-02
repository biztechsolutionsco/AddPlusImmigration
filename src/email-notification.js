import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";


export async function sendInquiryNotification(
    env,
    inquiry,
    inquiryId
) {

    const sender =
        "website@addplusimmigration.ca";

    const recipient =
        "addplusimmigration@gmail.com";


    const subject =
        `New AddPlus Inquiry - ${inquiry.service} - ${inquiry.first_name} ${inquiry.last_name}`;


    const message =
        createMimeMessage();


    message.setSender({
        name: "AddPlus Immigration Website",
        addr: sender
    });


    message.setRecipient(recipient);


    message.setHeader(
        "Reply-To",
        inquiry.email
    );


    message.setSubject(subject);


    message.addMessage({
        contentType: "text/plain",
        data: `
New website inquiry

Inquiry ID:
${inquiryId ?? "N/A"}

Name:
${inquiry.first_name} ${inquiry.last_name}

Email:
${inquiry.email}

Phone:
${inquiry.phone || "Not provided"}

Country of Citizenship:
${inquiry.citizenship || "Not provided"}

Current Country of Residence:
${inquiry.residence || "Not provided"}

Service:
${inquiry.service}

How they heard about us:
${inquiry.referral || "Not provided"}

Inquiry:
${inquiry.case_summary}

Submitted from:
${inquiry.form_source || "website"}

----------------------------------------

This email was automatically generated from the
AddPlus Immigration Solutions Inc. website inquiry form.
        `.trim()
    });


    const email =
        new EmailMessage(
            sender,
            recipient,
            message.asRaw()
        );


    await env.EMAIL.send(email);

}