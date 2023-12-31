import { FindAllType } from "@/typings/findAll.type";
import { ResponsePageData } from "@/typings/http.type";
import { HttpException, HttpStatus } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * @description 处理分页
 * @param {PageQueryType} query
 * @returns {{ skip: number, take: number }}
 */
export const handlePageQuery = (
  query: FindAllType,
): { skip: number; take: number } => {
  const { pageNum = 1, pageSize = 10 } = query;
  if (+pageNum === -1 || +pageSize === -1) {
    return {} as any;
  }
  const skip = (+pageNum - 1) * +pageSize;
  const take = +pageSize;
  return { skip, take };
};

/**
 * @description 处理模糊查询
 * @param {object} query
 * @param {array} keys
 * @returns {object}
 */
export const queryLike = <T extends object, K extends keyof T>(
  query: T,
  keys: K[],
): Record<K, { contains: string }> => {
  let wheres = {} as Record<K, { contains: string }>;
  for (const key in query) {
    if (keys.includes(key as unknown as K)) {
      wheres[key as unknown as K] = {
        contains: (query[key] || "") as string,
      };
    }
  }
  return wheres;
};

/**
 * @description 处理分页返回的数据
 * @param { string } table 表名称
 * @param { object } where 条件
 * @param { object } query 查询条件
 */

export const handlePageData = async <T extends object>(
  table: string,
  where: Record<string, any>,
  query: {
    pageNum: string;
    pageSize: string;
    [key: string]: any;
  },
  afterLoad?: (data: T[]) => T[],
): ResponsePageData<any> => {
  // 分页
  const page = handlePageQuery(query);
  // 模型实例
  const prisma = new PrismaClient();
  // 查询
  const result = await prisma[table].findMany({
    where: where,
    ...page,
  });
  //返回体
  return {
    dataList: afterLoad ? afterLoad(result) : result,
    total: await prisma[table].count({
      where: where,
    }),
    pageNum: +query.pageNum,
    pageSize: +query.pageSize,
  };
};

/**
 * @description 需要删除对象的字段
 * @param {object} target
 */

export const removeObjKeys = <T extends object, K extends keyof T>(
  target: T,
  keys: K[] | string[],
): T => {
  const result = {} as T;
  for (const key in target) {
    if (![0].includes(target[key] as any) && !target[key]) {
      continue;
    }
    if (!keys.includes(key as any)) {
      result[key] = target[key];
    }
  }
  return result;
};

/**
 * @description 查询创建人自己的数据和状态查询
 * 注意状态查询必须满足number类型
 * 状态 -1查询全部 其他的按对应状态查询
 * @param {object} query
 * @param { array } keys
 * @returns {object}
 */

export const whereCuserByStatus = <T extends object, K extends keyof T>(
  query: T,
  keys: {
    status: K[];
    cUserId: K;
  },
) => {
  let wheres = {} as Record<K, any>;
  for (const key in query) {
    // 状态
    if (keys.status.includes(key as unknown as K)) {
      if (+query[key] !== -1) {
        wheres[key as unknown as K] = +query[key];
      }
    }
    if (+query[keys.cUserId] !== 1) {
      //代表不是超管 因为超管查询所有
      wheres[keys.cUserId] = +query[keys.cUserId];
    }
  }
  return wheres;
};

/**
 * @description 统一报错处理 错误码默认为BAD_REQUEST 400
 * 如果只有错误提示可直接传参字符串
 * 如果需要自定义错误码则传对象
 * @param {object | string} option
 */

export const httpError = (
  option:
    | {
        msg?: string;
        code?: keyof typeof HttpStatus;
      }
    | string,
) => {
  if (typeof option === "string") {
    throw new HttpException(option, HttpStatus.BAD_REQUEST);
  } else {
    const { msg = "接口请求错误请联系管理员", code = "BAD_REQUEST" } = option;
    throw new HttpException(msg, HttpStatus[code]);
  }
};
