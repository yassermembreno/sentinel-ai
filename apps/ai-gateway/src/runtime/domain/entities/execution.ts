import { Message } from "../value-objects/message.js";

export interface Execution {
    id: string;
    sessionId: string;
    messages: Message[];
}