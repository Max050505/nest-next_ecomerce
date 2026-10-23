import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
@ApiProperty({description:'current PAss'})
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({description:'new Pass'})
  @IsNotEmpty({ message: 'shouldnt be empty password line' })
  @MinLength(8, {
    message: 'password should has no less than 8 characters',
  })
  @MaxLength(128, {
    message: 'max length is 128 characters',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'password should contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  @IsString()
  newPassword: string;
}
