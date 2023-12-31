import { Random } from "mockjs";
import { create } from "../helper";
import { hash } from "argon2";

export async function cUser() {
  create(1, async prisma => {
    await prisma.user.create({
      data: {
        userName: "wadmin",
        nickName: "彭于晏",
        address: "江苏省无锡市梁溪区",
        age: 18,
        status: 1,
        cUserId: 0,
        cUserName: "wadmin",
        userId: "W1",
        gender: 1,
        role: "admin",
        remark: "超级管理员",
        email: "1421788142@qq.com",
        avatar: Random.image("300x300"),
        password: await hash("wadmin123"),
      },
    });
  });
}
