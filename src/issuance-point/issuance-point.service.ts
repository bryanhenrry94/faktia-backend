import { Injectable } from '@nestjs/common';
import { CreateIssuancePointDto } from './dto/create-issuance-point.dto';
import { UpdateIssuancePointDto } from './dto/update-issuance-point.dto';

@Injectable()
export class IssuancePointService {
  create(createIssuancePointDto: CreateIssuancePointDto) {
    return 'This action adds a new issuancePoint';
  }

  findAll() {
    return `This action returns all issuancePoint`;
  }

  findOne(id: number) {
    return `This action returns a #${id} issuancePoint`;
  }

  update(id: number, updateIssuancePointDto: UpdateIssuancePointDto) {
    return `This action updates a #${id} issuancePoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} issuancePoint`;
  }
}
