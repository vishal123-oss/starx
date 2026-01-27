import nodemailer from 'nodemailer';

// Create Ethereal test account
let transporter: nodemailer.Transporter;

(async () => {
    try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        console.log('Ethereal test account created:', testAccount);
    } catch (error) {
        console.error('Failed to create test account:', error);
        // Fallback
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'fallback@example.com',
                pass: 'fallback'
            }
        });
    }
})();

/**
 * Send reminder email
 */
export async function sendReminderEmail(user: any, event: any, reminder: any) {
    const mailOptions = {
        from: 'EventManager <noreply@eventmanager.com>',
        to: user.email,
        subject: `Reminder: ${event.name} starts soon!`,
        html: `
            <h1>Event Reminder</h1>
            <p>Hi ${user.name || 'User'},</p>
            <p>This is a reminder for the event you registered for:</p>
            <h2>${event.name}</h2>
            <p><strong>Date:</strong> ${new Date(event.startDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(event.startDate).toLocaleTimeString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p>${event.description}</p>
            <p>We look forward to seeing you there!</p>
            <br>
            <p>Best regards,<br>Event Management Team</p>
        `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
}