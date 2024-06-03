import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const POST = async (req, res) => {
    try {
        const { to, subject, text } = await req.json();
        const transporter = nodemailer.createTransport({
            service: 'host',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, // generated ethereal user
                pass: process.env.EMAIL_PASSWORD, // generated ethereal password
            }
        });

        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: {
                name: 'Epm System',
                address: process.env.EMAIL_USER
            },
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
        });

        console.log("Message sent: %s", info.messageId);

        return NextResponse.json({ status: 200, message: 'Email sent' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, error: error.message });
    }
};
