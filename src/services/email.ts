import sgMail from '@sendgrid/mail'
import { MailDataRequired } from '@sendgrid/helpers/classes/mail'
import Response from '@sendgrid/helpers/classes/response'

const {
  SENDGRID_KEY,
  EMAIL_SENDER_ADDRESS
} = process.env
sgMail.setApiKey(SENDGRID_KEY)

interface Email {
  to?: string[];
  from?: string;
  subject: string;
  text: string;
  html: string;
}
interface InvitationRequest {
  to: string[];
  roomID: string;
}

// export const sendEmail = ({ to, subject, text, html }: Email): void => {
export const sendEmail = ({ to, subject, text, html }: Email): Promise<[Response, any]> => {
  const msg: MailDataRequired = {
    from: EMAIL_SENDER_ADDRESS,
    subject,
    text,
    html
  }
  const bcc = to
    .slice(1)
    .map(email => {
      return { email }
    })
  msg.personalizations = [{
    to: to[0],
    bcc
  }]

  return sgMail.send(msg)
}

export const sendInvitationEmail = ({ roomID, to }:InvitationRequest): Promise<[Response, any]> => {
// export const sendInvitationEmail = ({ roomID, to }:InvitationRequest): void => {
  return sendEmail({
    to,
    subject: 'You were invited to join a video chat room',
    text: `Here is the link to access the room: ${roomID}`,
    html: `<p>Here is the link to access the room: ${roomID}</p>`
  })
}
