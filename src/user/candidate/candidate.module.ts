import { Module, forwardRef } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { UserModule } from '../user.module';

@Module({
  providers: [CandidateService],
  controllers: [CandidateController],
  exports: [CandidateService],
  imports: [forwardRef(() => UserModule)],
})
export class CandidateModule {}
