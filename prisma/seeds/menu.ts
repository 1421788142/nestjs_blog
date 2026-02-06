import { create } from "../helper";

export async function cMenu() {
  // 先添加基础目录
  // create(1, async prisma => {
  //   await prisma.menu.create({
  //     data: {
  //       component: "home/index",
  //       path: "/home",
  //       menuType: "C",
  //       orderNum: 0,
  //       pId: 0,
  //       title: "接口文档",
  //       icon: "",
  //       perms: "",
  //       isFrame: 0,
  //       status: 1,
  //       keepAlive: 1,
  //       hidden: 0,
  //       cUserId: "W1",
  //     },
  //   });
  // });
  // create(1, async prisma => {
  //   await prisma.menu.create({
  //     data: {
  //       component: "Layout",
  //       path: "system",
  //       menuType: "M",
  //       orderNum: 1,
  //       pId: 0,
  //       title: "系统管理",
  //       icon: "",
  //       perms: "",
  //       isFrame: 0,
  //       status: 1,
  //       keepAlive: 1,
  //       hidden: 0,
  //       cUserId: "W1",
  //     },
  //   });
  // });
  // 菜单添加完后根据系统管理id添加以下菜单
  // create(1, async prisma => {
  //   await prisma.menu.create({
  //     data: {
  //       component: "system/user/index",
  //       path: "/system/user",
  //       menuType: "C",
  //       orderNum: 0,
  //       pId: 2,
  //       title: "用户管理",
  //       icon: "",
  //       perms: "",
  //       isFrame: 0,
  //       status: 1,
  //       keepAlive: 1,
  //       hidden: 0,
  //       cUserId: "W1",
  //     },
  //   });
  // });
  // create(1, async prisma => {
  //   await prisma.menu.create({
  //     data: {
  //       component: "system/menu/index",
  //       path: "/system/menu",
  //       menuType: "C",
  //       orderNum: 1,
  //       pId: 2,
  //       title: "菜单管理",
  //       icon: "",
  //       perms: "",
  //       isFrame: 0,
  //       status: 1,
  //       keepAlive: 1,
  //       hidden: 0,
  //       cUserId: "W1",
  //     },
  //   });
  // });
  // create(1, async prisma => {
  //   await prisma.menu.create({
  //     data: {
  //       component: "",
  //       path: "",
  //       menuType: "F",
  //       orderNum: 1,
  //       pId: 3,
  //       title: "新增",
  //       icon: "",
  //       perms: "add",
  //       isFrame: 0,
  //       status: 1,
  //       keepAlive: 1,
  //       hidden: 0,
  //       cTime: new Date(),
  //       cUserId: "W1",
  //     },
  //   });
  // });
  // create(1, async prisma => {
  //   await prisma.menu.create({
  //     data: {
  //       component: "",
  //       path: "",
  //       menuType: "F",
  //       orderNum: 1,
  //       pId: 3,
  //       title: "编辑",
  //       icon: "",
  //       perms: "update",
  //       isFrame: 0,
  //       status: 1,
  //       keepAlive: 1,
  //       hidden: 0,
  //       cTime: new Date(),
  //       cUserId: "W1",
  //     },
  //   });
  // });
  // create(1, async prisma => {
  //   await prisma.menu.create({
  //     data: {
  //       component: "system/role/index",
  //       path: "/system/role",
  //       menuType: "C",
  //       orderNum: 2,
  //       pId: 2,
  //       title: "角色管理",
  //       icon: "",
  //       perms: "",
  //       isFrame: 0,
  //       status: 1,
  //       keepAlive: 1,
  //       hidden: 0,
  //       cUserId: "W1",
  //     },
  //   });
  // });
}
