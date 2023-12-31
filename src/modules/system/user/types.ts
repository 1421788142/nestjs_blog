import { FindAllType } from "@/typings/findAll.type";

export interface PageQueryType extends FindAllType {
  userName: string;
  nickName: string;
  role: string;
  cUserId: number;
  createTime: Array<Date>;
  status: string;
}
