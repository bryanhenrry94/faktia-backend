import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipsService.create(createMembershipDto);
  }

  @Post('/invite')
  invite(@Body() body: { email: string }, @Req() req: Request) {
    const subdomain = req['tenant-subdomain'];

    return this.membershipsService.invite(body.email, subdomain);
  }

  @Post('/resend-invite')
  resentInvite(@Body() body: { invitation: string }) {
    return this.membershipsService.resendInvite(body.invitation);
  }

  @Post('/accept-invite')
  acceptInvite(@Body() body: { invitation: string }) {
    return this.membershipsService.acceptInvite(body.invitation);
  }

  @Post('/decline-invite')
  declineInvite(@Body() body: { invitation: string }) {
    return this.membershipsService.declineInvite(body.invitation);
  }

  @Get()
  findAll(@Req() req: Request) {
    const subdomain = req['tenant-subdomain'];

    return this.membershipsService.findAll(subdomain);
  }

  @Get('/tenant/:tenantId')
  findAllByTenantId(@Param('tenantId') tenantId: string) {
    return this.membershipsService.findAllByTenantId(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return this.membershipsService.update(id, updateMembershipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipsService.remove(id);
  }
}
