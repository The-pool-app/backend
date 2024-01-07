-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_job_detailsJobId_fkey";

-- AddForeignKey
ALTER TABLE "job_details" ADD CONSTRAINT "job_details_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
