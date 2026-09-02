import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// Role sengaja TIDAK ada di sini. Register publik selalu jadi MEMBER,
// dipaksa di AuthService - lihat catatan di users.service.ts.
export class RegisterDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: 'budi@pineapplestack.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
