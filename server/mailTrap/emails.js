import { VERIFICATION_EMAIL_TEMPLATE } from "./emailtemplate.js";
import { mailtrapClient } from "./mailtrap.config.js";
import { sender } from "./mailtrap.config.js";


export const sendVerificationEmail = async( email, name, verificationToken ) => {
    // const recipient = [{email}];
    const recipient = [{email: 'akat73441@gmail.com'}];
    try {
        const response = await mailtrapClient
    .send({
        from: sender,
        to: recipient,
        subject: "Verify your email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{name}", name).replace("{verificationCode}", verificationToken),
        category: "Email verification",
    })
    .then(console.log, console.error);
    console.log(" Email sent successfilly ", response)
    } catch (error) {
       console.error (`error sending verification email`, error);
       throw new Error(`error sending verification email: ${error}`);
    }
}

export const sendWelcomeEmail = async (email, name) => {
	// const recipient = [{ email }];
    const recipient = [{email: 'akat73441@gmail.com'}];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Welcome to Blogify",
            text: "Welcome to our site, Login and start Creating post ...",
            category: "Welcome Email"
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending, welcome, email`, error);
		throw new Error(`Error sending, welcome, email: ${error}`);
	}
};