import cors from "cors";
const ACCEPTED_ORIGINS = ["http://localhost:1234","http://localhost:5173"];
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
    cors({
        origin: (origin, callback) => {
            if (!origin || acceptedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(null, false);
        },
    });

