import { SetMetadata } from "@nestjs/common";

// 定义一个自定义装饰器，用于标记需要过滤字段的控制器方法
export const FilterFields = (fieldsToRemove: string[] = []) => {
  let newFields = [
    "cUserName",
    "mUserId",
    "cUserId",
    "mTime",
    "mUserName",
    "cTime",
    ...fieldsToRemove,
  ];
  return SetMetadata("fieldsToRemove", newFields);
};
