import { IsNotEmpty } from 'class-validator';

export class SendmaiLDto {
  @IsNotEmpty()
  readonly receivermail: string;
  @IsNotEmpty()
  readonly content: string;
  @IsNotEmpty()
  readonly subject: string;
}
