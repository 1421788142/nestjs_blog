export type ResponsePageData<T extends object> = Promise<{
  dataList: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}>;
