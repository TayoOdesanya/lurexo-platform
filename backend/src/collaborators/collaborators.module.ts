import { Module } from '@nestjs/common';
import { CollaboratorsController } from './collaborators.controller';
import { CollaboratorsService } from './collaborators.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [CollaboratorsController],
  providers: [CollaboratorsService],
})
export class CollaboratorsModule {}
