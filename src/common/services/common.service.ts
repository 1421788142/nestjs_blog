import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import GetFileDto from "@/common/dto/getFile.dto";
import { HttpAdapterHost } from "@nestjs/core";

@Injectable()
export class CommonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) { }

  // 动态获取当前项目的运行ip端口
  async getIpPort() {
    const server = this.httpAdapterHost.httpAdapter.getHttpServer();
    const addressInfo = server.address();
    const address =
      addressInfo.address === "::" ? "localhost" : addressInfo.address;
    const port = addressInfo.port;
    // return `http://${address}:${port}`;
    return `http://test.wiipark.com:${port}`;
  }

  // 获取文件
  async getFile(query: GetFileDto) {
    const ipByPort = await this.getIpPort();
    let files = await this.prisma.uploadFile.findMany({
      where: {
        fileId: {
          in: query.fileIds.split(","),
        },
        fileType: query.fileType,
      },
    });
    return files.map(m => ({
      ...m,
      // 目前开发环境本地图片,所以取项目运行ip端口
      filePath: `${ipByPort}${m.filePath}`,
    }));
  }
}
