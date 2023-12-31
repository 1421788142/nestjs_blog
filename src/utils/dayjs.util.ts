import dayjs from "dayjs";

export const formatDate = (data: { type: string; value: any }): any => {
  const formatType = data.type ?? "YYYY-MM-DD HH:mm:ss";
  return dayjs(data.value).format(formatType);
};
