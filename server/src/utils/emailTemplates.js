/**
 * Generate acceptance + interview schedule HTML email
 *
 * @param {Object} params
 * @param {string} params.candidateName
 * @param {string} params.position
 * @param {string} params.interviewDate  - e.g. "2024-05-20"
 * @param {string} params.interviewTime  - e.g. "10:30 AM"
 * @param {string} params.interviewMode  - "Online" or "In-Person"
 * @param {string} params.meetingLink    - optional
 * @param {string} params.icsLink        - download .ics URL
 * @param {string} params.calendarLink   - pre-filled Google Calendar URL
 * @returns {string} HTML string
 */
const buildAcceptanceEmail = ({
  candidateName,
  position,
  interviewDate,
  interviewTime,
  interviewMode,
  meetingLink,
  icsLink,
  calendarLink,
}) => {
  const formattedDate = new Date(interviewDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const meetingSection = meetingLink
    ? `<tr>
        <td style="padding:6px 0;color:#9ca3af;font-size:14px;">Meeting Link</td>
        <td style="padding:6px 0;font-size:14px;">
          <a href="${meetingLink}" style="color:#60a5fa;">${meetingLink}</a>
        </td>
       </tr>`
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                🎉 Congratulations!
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">
                Your application has been accepted
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 16px;color:#e2e8f0;font-size:16px;line-height:1.6;">
                Dear <strong>${candidateName}</strong>,
              </p>
              <p style="margin:0 0 24px;color:#94a3b8;font-size:15px;line-height:1.7;">
                We are thrilled to inform you that your application for the position of
                <strong style="color:#e2e8f0;">${position}</strong> has been reviewed and accepted.
                We were impressed by your profile and would like to invite you for an interview.
              </p>

              <!-- Interview Details Box -->
              <div style="background-color:#0f172a;border:1px solid #334155;border-radius:12px;padding:24px 28px;margin-bottom:28px;">
                <h2 style="margin:0 0 16px;color:#60a5fa;font-size:16px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">
                  📅 Interview Details
                </h2>
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:6px 0;color:#9ca3af;font-size:14px;width:120px;">Date</td>
                    <td style="padding:6px 0;color:#e2e8f0;font-size:14px;font-weight:600;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#9ca3af;font-size:14px;">Time</td>
                    <td style="padding:6px 0;color:#e2e8f0;font-size:14px;font-weight:600;">${interviewTime}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#9ca3af;font-size:14px;">Mode</td>
                    <td style="padding:6px 0;color:#e2e8f0;font-size:14px;font-weight:600;">${interviewMode}</td>
                  </tr>
                  ${meetingSection}
                </table>
              </div>

              <!-- CTA Buttons -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <a href="${calendarLink}" target="_blank"
                      style="display:inline-block;background:linear-gradient(135deg,#16a34a,#15803d);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                      📆 Add to Google Calendar
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${icsLink}" target="_blank"
                      style="display:inline-block;background:transparent;color:#60a5fa;text-decoration:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:500;border:1px solid #3b82f6;">
                      ⬇️ Download .ics Calendar File
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;color:#94a3b8;font-size:14px;line-height:1.7;">
                Please make sure to be available at the scheduled time. If you have any questions,
                feel free to reply to this email.
              </p>
              <p style="margin:12px 0 0;color:#94a3b8;font-size:14px;">
                Best regards,<br/>
                <strong style="color:#e2e8f0;">The Recruitment Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0f172a;padding:20px 40px;border-top:1px solid #334155;text-align:center;">
              <p style="margin:0;color:#475569;font-size:12px;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

module.exports = buildAcceptanceEmail;
