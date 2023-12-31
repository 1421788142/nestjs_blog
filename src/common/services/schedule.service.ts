import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  // 定时清除垃圾文件(未再数据库中进行绑定的文件)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // 每天凌晨执行一次
  async intervalclearFile() {
    console.log("触发1");
  }
}
