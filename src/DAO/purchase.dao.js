import { TicketModel } from "../models/ticket.model.js"

export default class Purchase {
    getTicket = async () => {
        try {
            const result =  TicketModel.find().populate({
                path: 'products.product',
                model: 'products'
            })
            
            return result;
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