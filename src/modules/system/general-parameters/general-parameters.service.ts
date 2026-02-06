import { Injectable } from "@nestjs/common";
import { CreateGeneralParameterDto } from "./dto/create-general-parameter.dto";
import { UpdateGeneralParameterDto } from "./dto/update-general-parameter.dto";
import { PrismaService } from "@/common/prisma/prisma.service";

@Injectable()
export class GeneralParametersService {
  constructor(private prisma: PrismaService) {}
  create(createGeneralParameterDto: CreateGeneralParameterDto) {
    return "This action adds a new generalParameter";
  }

  async findAll(query: any) {
    const where = {
      name: {
        contains: query.name || "",
      },
    };
    const result = await this.prisma.generalParameters.findMany({
      where: where,
    });
    return {
      dataList: result,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} generalParameter`;
  }

  update(id: number, updateGeneralParameterDto: UpdateGeneralParameterDto) {
    return `This action updates a #${id} generalParameter`;
  }

  remove(id: number) {
    return `This action removes a #${id} generalParameter`;
  }
}
