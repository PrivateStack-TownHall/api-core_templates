import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // Dipakai AuthService.register - role SELALU dipaksa MEMBER di sini,
  // tidak pernah menerima role dari input caller. Karena User ini di-share
  // ke 4 app lain di Operations Core, ini satu-satunya jalur bikin user baru
  // yang aman dari privilege escalation.
  async createMember(data: {
    fullName: string;
    email: string;
    password: string;
  }) {
    return this.prisma.user.create({
      data: { ...data, role: Role.MEMBER },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
