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

export const sendIntakeNotification = async (intake) => {
  const config = getMailerConfig();
  if (!config) {
    console.warn('Intake email notification skipped: SMTP configuration is incomplete.');
    return { sent: false, reason: 'smtp_not_configured' };
  }

  const transporter = nodemailer.createTransport(config);
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
