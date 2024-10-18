import { TicketModel } from "../models/ticket.model.js"

export default class Purchase {
    getTicket = async () => {
        try {
            return await TicketModel.find()
        } catch (error) {
            console.error(error.message)
        }
    }

    createTicket = async (ticket) => {
        try {
            return await TicketModel.create(ticket)
        } catch (error) {
            console.error(error.message)
        }
    }
}