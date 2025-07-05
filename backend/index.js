import express from 'express'
import cors from 'cors'
import {v4 as uuidv4} from 'uuid'
import dotenv from 'dotenv'
import ItalianChatbot from './chatbot.js'

dotenv.config({path: './config.env'})
const app = express()
const PORT = process.env.PORT

// app.use(cors())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json())

const chatbot = new ItalianChatbot()

const sessions = new Map()

app.post('/api/chat', (req, res)=>{
    try{
        const {message, sessionId} = req.body
        if(!message){
            return res.status(400).json({error: "Message not found."})
        }

        const currentSessionId = sessionId || uuidv4()
        if(!sessions.has(currentSessionId)){
            sessions.set(currentSessionId,{
                id: currentSessionId, 
                createdAt: new Date(),
                messages: []
            })
        }

        const session = sessions.get(currentSessionId)

        const result = chatbot.processMessage(message)

        session.messages.push(
            {type: 'user', content: message, timestamp: new Date()},
            {type: 'bot', content: result.response, timestamp: new Date(), additionalData: result.additionalData}
        )

        res.json({
            sessionId: currentSessionId,
            response: result.response,
            additionalData: result.additionalData,
            intent: result.intent
        })
    }
    catch(error){
        console.log('Error: ', error)
        res.status(500).json({error: 'Internal server error'})
    }
})

app.get('/api/session/:sessionId', (req, res)=>{
    const {sessionId} = req.params
    const session = sessions.get(sessionId)

    if(!session){
        return res.status(404).json({error: 'Session not found'})
    }
    res.json(session)
})

app.get('/api/health', (req, res)=>{
    res.json({status: 'ok', timestamp: new Date()})
})

app.listen(PORT, ()=>{
    console.log(`chatbot running on port ${PORT}`)
})