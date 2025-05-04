import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('tenant/:tenantId')
  findAllByTenantId(@Param('tenantId') tenantId: string) {
    return this.userService.findAllByTenantId(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  //change-password
  @Patch('change-password/:id')
  changePassword(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!updateUserDto.password) {
      throw new Error('La contraseña es obligatoria');
    }
    return this.userService.changePassword(id, updateUserDto.password);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
