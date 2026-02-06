import { FindAllType } from "@/typings/findAll.type";

export interface PageQueryType extends FindAllType {
  projectName: string;
  status: string;
}
