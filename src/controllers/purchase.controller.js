import Purchase from "../DAO/purchase.dao.js";

const purchaseService = new Purchase()

export const getTicket = async (req, res) => {
    try {
        const result = await purchaseService.getTicket()
        res.status(200).json({ message: "Tickets found", payload: result })
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: "Error getting tickets" })
    }
}

export const createTicket = async (req, res) => {
    const ticket = req.body

    try {
        const result = await purchaseService.createTicket(ticket)
        res.status(201).json({ message: "Ticket created", payload: result })
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: "Error creating ticket" })
    }
}