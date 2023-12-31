import { create } from "../helper"

export async function cMenu() {
    create(1, async (prisma) => {
        await prisma.menu.create({
            data: {
                component: "system/user/index",
                path: "/system/user",
                menuType: "C",
                orderNum: 2,
                pId: 2,
                title: "用户管理",
                icon: "",
                perms: "",
                isFrame: 0,
                status: 1,
                keepAlive: 1,
                hidden: 0,
            }
        })
    })
}