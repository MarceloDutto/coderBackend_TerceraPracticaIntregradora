import mongoose from "mongoose";

const TicketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    purchase_datetime: String,
    amount: Number,
    purchaser: String
});

const Ticket = mongoose.model(TicketCollection, ticketSchema);

export default Ticket;