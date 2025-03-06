import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export async function getAll() {
    return prisma.repository.findMany()
}

export async function getByName(ownerName: string, repositoryName: string) {
    return prisma.repository.findFirst({
        where: {owner_name: ownerName, name: repositoryName}
    })
}

export async function getById(id: number) {
    return prisma.repository.findFirst({
        where: {id: id}
    })
}

export async function sync() {

}
