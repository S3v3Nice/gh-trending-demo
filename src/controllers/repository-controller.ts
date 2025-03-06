import * as repositoryService from '../services/repository-service'
import {Request, Response} from 'express'

export async function getAll(req: Request, res: Response) {
    const repositories = await repositoryService.getAll()
    res.json(repositories)
}

export async function getByName(req: Request, res: Response) {
    const ownerName = req.params['owner']
    const repositoryName = req.params['repository']
    const record = await repositoryService.getByName(ownerName, repositoryName)
    res.json(record)
}

export async function getById(req: Request, res: Response) {
    const id = parseInt(req.params['id'])
    const record = await repositoryService.getById(id)
    res.json(record)
}

export async function sync(req: Request, res: Response) {
    res.json({success: true})
}
