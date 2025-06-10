
import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum ScriptType {
  BASH = 'bash',
  POWERSHELL = 'powershell'
}

export class InstallationScriptDto {
  @ApiProperty({ enum: ScriptType })
  @IsEnum(ScriptType)
  type: ScriptType;

  @ApiProperty()
  @IsString()
  content: string;
}
