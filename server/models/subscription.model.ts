import mongoose, { Schema } from "mongoose";
import { ISubscription } from "../types/subsription.types";

const subsriptionSchema = new Schema<ISubscription>({
    channel: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    subscriber: {
        type: mongoose.Types.ObjectId,
        required: true
    }    
})

const Subscription = mongoose.model("Subscription", subsriptionSchema);

export default Subscription;