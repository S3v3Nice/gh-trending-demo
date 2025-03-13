class SyncError extends Error {
    public readonly statusCode: number

    constructor(message: string, statusCode = 500) {
        super(message)
        this.name = 'SyncError'
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}

export default SyncError
