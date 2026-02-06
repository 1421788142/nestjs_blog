import { FindAllType } from "@/typings/findAll.type";

export interface PageQueryType extends FindAllType {
  directoryName: string;
  status: string;
}
