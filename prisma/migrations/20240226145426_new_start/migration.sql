-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('RECRUITER', 'CANDIDATE');

-- CreateEnum
CREATE TYPE "ApplicantExperienceLevel" AS ENUM ('JUNIOR', 'MID_LEVEL', 'SENIOR');

-- CreateEnum
CREATE TYPE "jobDuration" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "ApplicantStatus" AS ENUM ('ACTIVELY_LOOKING', 'NOT_LOOKING', 'OPEN_TO_OFFERS');

-- CreateEnum
CREATE TYPE "workType" AS ENUM ('REMOTE', 'ONSITE', 'HYBRID');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "subscription_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "expiresIn" TEXT NOT NULL,
    "planId" TEXT NOT NULL DEFAULT 'Sample Plan',
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subscriptionTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_details" (
    "jobId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "workType" "workType" NOT NULL,
    "jobDuration" "jobDuration" NOT NULL,
    "experience" "ApplicantExperienceLevel" NOT NULL,
    "salaryRange" TEXT NOT NULL,

    CONSTRAINT "job_details_pkey" PRIMARY KEY ("jobId")
);

-- CreateTable
CREATE TABLE "company" (
    "name" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "businessSector" TEXT NOT NULL,
    "jobs" INTEGER[],

    CONSTRAINT "company_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "roleId" "UserRole" NOT NULL DEFAULT 'CANDIDATE',
    "professional_detailsUserId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "postedById" INTEGER NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "education" (
    "userId" INTEGER NOT NULL,
    "schoolName" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "graduationDate" TIMESTAMP(3) NOT NULL,
    "professional_detailsUserId" INTEGER,

    CONSTRAINT "education_pkey" PRIMARY KEY ("schoolName")
);

-- CreateTable
CREATE TABLE "work_experience" (
    "userId" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "professional_detailsUserId" INTEGER,

    CONSTRAINT "work_experience_pkey" PRIMARY KEY ("companyName")
);

-- CreateTable
CREATE TABLE "user_activities" (
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "personal_details" (
    "userId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phoneNumber" TEXT,
    "location" TEXT,
    "sex" "Gender",
    "dateOfBirth" TIMESTAMP(3),
    "meansOfIdentification" TEXT,
    "profilePicture" TEXT,
    "profileVideo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_details_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_details" (
    "userId" INTEGER NOT NULL,
    "status" "ApplicantStatus" NOT NULL DEFAULT 'NOT_LOOKING',
    "jobRole" TEXT,
    "yearsOfExperience" INTEGER NOT NULL,
    "professionalSummary" TEXT,
    "jobPreference" "workType" NOT NULL DEFAULT 'REMOTE',
    "skills" TEXT[],
    "interests" TEXT[],
    "salaryRange" TEXT,
    "experienceLevel" "ApplicantExperienceLevel" NOT NULL DEFAULT 'JUNIOR',
    "highestEducation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professional_details_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "personal_details_userId_key" ON "personal_details"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "personal_details_email_key" ON "personal_details"("email");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscriptionTypeId_fkey" FOREIGN KEY ("subscriptionTypeId") REFERENCES "subscription_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_details" ADD CONSTRAINT "job_details_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_professional_detailsUserId_fkey" FOREIGN KEY ("professional_detailsUserId") REFERENCES "professional_details"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_professional_detailsUserId_fkey" FOREIGN KEY ("professional_detailsUserId") REFERENCES "professional_details"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_professional_detailsUserId_fkey" FOREIGN KEY ("professional_detailsUserId") REFERENCES "professional_details"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_details" ADD CONSTRAINT "personal_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
