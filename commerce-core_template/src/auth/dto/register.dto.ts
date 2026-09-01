import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Admin',
  })
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({
    example: 'admin@kingsbrew.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123',
  })
  @IsNotEmpty()
  password!: string;
}
