import * as repositoryService from '../services/repository-service'
import {Request, Response} from 'express'
import SyncError from '../errors/sync-error'

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
    try {
        await repositoryService.sync()
        res.json({success: true})
    } catch (error) {
        if (error instanceof SyncError) {
            res.status(error.statusCode).json({success: false, error: error.message})
        }
    }
}
