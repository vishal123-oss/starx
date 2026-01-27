import { eq } from 'drizzle-orm';
import CryptoJS from 'crypto-js';

import { db } from '../db/schema';
import { tickets } from '../db/schema/ticket';
import { env } from '../config/env';

/**
 * @description Ticket service to handle ticket operations
 */
class TicketService {
    private encryptionKey: string;

    constructor() {
        this.encryptionKey = env.TICKET_ENCRYPTION_KEY || 'default-secret-key-change-in-prod';
    }

    /**
     * @description Generate encrypted QR data for a ticket
     */
    private generateEncryptedQRData(ticketId: string, eventId: string, userId: string): string {
        const payload = {
            ticketId,
            eventId,
            userId,
            issuedAt: Date.now(),
        };
        const jsonPayload = JSON.stringify(payload);
        const encrypted = CryptoJS.AES.encrypt(jsonPayload, this.encryptionKey).toString();
        return encrypted;
    }

    /**
     * @description Create a new ticket for a booking
     */
    public async createTicket(bookingId: string, eventId: string, userId: string) {
        if (!db) {
            // Mock ticket for development
            const ticketId = crypto.randomUUID();
            const qrData = this.generateEncryptedQRData(ticketId, eventId, userId);

            return {
                id: qrData,
                bookingID: bookingId,
                status: 'ISSUED',
                issuedAt: new Date(),
                qrData: qrData,
            };
        }

        const ticketId = crypto.randomUUID();
        const qrData = this.generateEncryptedQRData(ticketId, eventId, userId);

        const newTicket = await db.insert(tickets).values({
            id: qrData, // Use encrypted string as unique ID
            bookingID: bookingId,
            status: 'ISSUED',
            issuedAt: new Date(),
            qrData: qrData, // Store the encrypted data
        }).returning();

        return newTicket[0];
    }

    /**
     * @description Get ticket by ID (encrypted QR data)
     */
    public async getTicketById(ticketId: string) {
        if (!db) {
            // Mock ticket for development
            try {
                const payload = this.decryptQRData(ticketId);
                return {
                    id: ticketId,
                    bookingID: 'mock-booking',
                    status: 'ISSUED',
                    issuedAt: new Date(),
                    qrData: ticketId,
                };
            } catch (error) {
                return null;
            }
        }

        const ticket = await db.select().from(tickets).where(eq(tickets.id, ticketId)).limit(1);
        return ticket[0] || null;
    }

    /**
     * @description Check in a ticket
     */
    public async checkInTicket(ticketId: string, checkedInBy: string) {
        if (!db) {
            // Mock check in
            return {
                id: ticketId,
                status: 'CHECKED_IN',
                checkedInAt: new Date(),
                checkedInBy,
            };
        }

        const result = await db.update(tickets)
            .set({
                status: 'CHECKED_IN',
                checkedInAt: new Date(),
                checkedInBy,
                updatedAt: new Date(),
            })
            .where(eq(tickets.id, ticketId))
            .returning();

        return result[0] || null;
    }

    /**
     * @description Decrypt QR data (for validation or debugging)
     */
    public decryptQRData(encryptedData: string): any {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decrypted);
        } catch (error) {
            throw new Error('Invalid QR data');
        }
    }

    /**
     * @description Verify a ticket by ID (for scanning/checking validity)
     */
    public async verifyTicket(ticketId: string) {
        if (!db) {
            // Mock verify for development
            try {
                const payload = this.decryptQRData(ticketId);
                return {
                    valid: true,
                    ticket: {
                        id: ticketId,
                        eventId: payload.eventId,
                        userId: payload.userId,
                        issuedAt: payload.issuedAt,
                        status: 'ISSUED',
                    },
                };
            } catch (error) {
                return { valid: false, message: 'Invalid ticket ID' };
            }
        }

        // Decrypt to get payload
        let payload;
        try {
            payload = this.decryptQRData(ticketId);
        } catch (error) {
            return { valid: false, message: 'Invalid ticket ID' };
        }

        // Check if ticket exists in DB
        const ticket = await this.getTicketById(ticketId);
        if (!ticket) {
            return { valid: false, message: 'Ticket not found' };
        }

        // Check status
        if (ticket.status === 'CANCELLED' || ticket.status === 'REFUNDED') {
            return { valid: false, message: 'Ticket is cancelled or refunded' };
        }

        if (ticket.status === 'CHECKED_IN') {
            return { valid: false, message: 'Ticket already checked in', checkedInAt: ticket.checkedInAt };
        }

        // Valid
        return {
            valid: true,
            ticket: {
                id: ticket.id,
                eventId: payload.eventId,
                userId: payload.userId,
                issuedAt: payload.issuedAt,
                status: ticket.status,
            },
        };
    }
}

export const ticketService = new TicketService();