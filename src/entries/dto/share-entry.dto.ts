import { IsNotEmpty, IsString } from 'class-validator';

export class ShareEntryDto {
  @IsString()
  @IsNotEmpty()
  recipientUsername!: string;
}
