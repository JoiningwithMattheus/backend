import { EntryMood } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEntryDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsEnum(EntryMood)
  @IsOptional()
  mood?: EntryMood;
}
