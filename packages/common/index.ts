export interface SignupIncomnig {
    ip: string;
    publicKey: string;
    signedMessage: string;
    callbackId: string;
}
export interface SignupOutgoing {
    validatorId:string;
    callbackId: string;
}
export interface ValidateIncoming {
    callbackId: string;
    signedMessage: string;
    status: 'UP' | 'DOWN';
    latency: number;
    websiteId: string;
    validatorId: string;
}
export interface ValidateOutgoing {
    url: string;
    callbackId: string;
    websiteId: string;
}

export type IncomingMessage = {
    type: 'signup',
    data: SignupIncomnig
} | {
    type : 'validate',
    data: ValidateIncoming

}

export type OutgoingMessage = {
    type: 'signup',
    data: SignupOutgoing
} | {
    type: 'validate',
    data: ValidateOutgoing
}

