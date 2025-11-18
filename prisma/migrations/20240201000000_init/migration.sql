CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "IntakeStatus" AS ENUM ('NEW', 'REVIEWING', 'QUALIFIED', 'NOT_A_FIT');

-- CreateTable
CREATE TABLE "Intake" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "annualRevenueRange" TEXT NOT NULL,
    "netWorthRange" TEXT NOT NULL,
    "liquidityRange" TEXT NOT NULL,
    "fundingNeed" TEXT NOT NULL,
    "useOfFunds" TEXT NOT NULL,
    "timeHorizonMonths" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "IntakeStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Intake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- Trigger to update updatedAt
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_intake_updated_at
BEFORE UPDATE ON "Intake"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER update_admin_updated_at
BEFORE UPDATE ON "AdminUser"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
