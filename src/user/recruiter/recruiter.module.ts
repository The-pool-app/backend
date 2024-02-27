import { Module, forwardRef } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { RecruiterController } from './recruiter.controller';
import { UserModule } from '../user.module';

@Module({
  providers: [RecruiterService],
  controllers: [RecruiterController],
  exports: [RecruiterService],
  imports: [forwardRef(() => UserModule)],
})
export class RecruiterModule {}
