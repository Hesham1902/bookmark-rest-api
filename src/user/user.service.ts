import { Injectable } from '@nestjs/common';
import { AuthDto } from 'src/auth/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async update(userId: number, body: EditUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...body },
    });
    delete user.hash;
    return user;
  }
}
