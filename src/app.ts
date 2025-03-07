import dotenv from 'dotenv'
import express from 'express'
import repositoryRoutes from './routes/repository-routes'
import * as repositoryService from './services/repository-service'

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/repositories', repositoryRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
    repositoryService.startAutoSync()
})
