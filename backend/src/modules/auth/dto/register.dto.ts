import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsNotEmpty({ message: 'email is empty' })
  @IsEmail({}, { message: 'email should be valid' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
    minLength: 8,
    maxLength: 128,
  })
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
  password: string;

  @ApiPropertyOptional({
    example: 'John',
    description: 'User first name',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'User last name',
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}