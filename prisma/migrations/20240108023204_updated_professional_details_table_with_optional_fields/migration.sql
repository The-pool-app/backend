-- AlterTable
ALTER TABLE "professional_details" ALTER COLUMN "jobRole" DROP NOT NULL,
ALTER COLUMN "professionalSummary" DROP NOT NULL,
ALTER COLUMN "salaryRange" DROP NOT NULL,
ALTER COLUMN "experienceLevel" SET DEFAULT 'JUNIOR',
ALTER COLUMN "highestEducation" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'NOT_LOOKING';
