import Ticket from "../models/ticket.models.js";

class TicketManager {

    getAll = async () => {
        try {
            const tickets = await Ticket.find();
            return tickets;
        } catch(error) {
            throw error;
        }
    };

    getById = async (tidRef) => {
        try {
            const ticket = await Ticket.findById(tidRef);
            return ticket? ticket : {};
        } catch(error) {
            throw error;
        }
    }

    create = async (ticketInfo) => {
        try {
            const newTicket = await Ticket.create(ticketInfo);
            return newTicket;
        } catch(error) {
            throw error;
        }
    };
};

export default TicketManager;