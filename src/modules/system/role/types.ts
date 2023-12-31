import { FindAllType } from "@/typings/findAll.type";

export interface PageQueryType extends FindAllType {
  roleName: string;
  status: string;
}
