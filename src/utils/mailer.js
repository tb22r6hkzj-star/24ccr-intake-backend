import nodemailer from 'nodemailer';

const getMailerConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  };
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return 'Not provided';
  return String(value);
};

const getTransporter = () => {
  const config = getMailerConfig();
  if (!config) {
    return null;
  }
  return nodemailer.createTransport(config);
};

export const sendIntakeNotification = async (intake) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Intake email notification skipped: SMTP configuration is incomplete.');
    return { sent: false, reason: 'smtp_not_configured' };
  }

  const to = process.env.INTAKE_NOTIFICATION_TO || 'info@24ccrgroup.com';
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const subject = `New 24CCR Intake: ${formatValue(intake.companyName)} — ${formatValue(intake.contactName)}`;

  const text = [
    'A new 24CCR client intake was submitted.',
    '',
    `Company: ${formatValue(intake.companyName)}`,
    `Contact: ${formatValue(intake.contactName)}`,
    `Email: ${formatValue(intake.email)}`,
    `Phone: ${formatValue(intake.phone)}`,
    `State: ${formatValue(intake.state)}`,
    `Industry: ${formatValue(intake.industry)}`,
    `Annual Revenue Range: ${formatValue(intake.annualRevenueRange)}`,
    `Net Worth Range: ${formatValue(intake.netWorthRange)}`,
    `Liquidity Range: ${formatValue(intake.liquidityRange)}`,
    `Funding Need: ${formatValue(intake.fundingNeed)}`,
    `Use of Funds: ${formatValue(intake.useOfFunds)}`,
    `Time Horizon (months): ${formatValue(intake.timeHorizonMonths)}`,
    `Notes: ${formatValue(intake.notes)}`,
    `Status: ${formatValue(intake.status)}`,
    `Submitted: ${formatValue(intake.createdAt)}`,
    `Intake ID: ${formatValue(intake.id)}`,
  ].join('\n');

  await transporter.sendMail({
    from,
    to,
    replyTo: intake.email,
    subject,
    text,
  });

  return { sent: true };
};

export const sendIntakeConfirmation = async (intake) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Client confirmation email skipped: SMTP configuration is incomplete.');
    return { sent: false, reason: 'smtp_not_configured' };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const replyTo = process.env.INTAKE_NOTIFICATION_TO || 'info@24ccrgroup.com';
  const name = formatValue(intake.contactName);

  const subject = '24CCR Capital Alignment Request Received';
  const text = [
    `Hello ${name},`,
    '',
    'Thank you for submitting your Capital Alignment request to 24CCR. Your information has been received and will be reviewed for fit and next-step direction.',
    '',
    'Submission does not guarantee acceptance, financing, approval, placement, or any specific outcome. If additional information is needed, we will contact you using the information you provided.',
    '',
    '24CCR Group',
    'info@24ccrgroup.com',
  ].join('\n');

  await transporter.sendMail({
    from,
    to: intake.email,
    replyTo,
    subject,
    text,
  });

  return { sent: true };
};
