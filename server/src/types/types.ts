export interface User {
    user_id: number;
    email: string;
    password: string;
}

export interface Entry {
    entry_id: number;
    user_id: number;
    tips_total: number;
    num_transactions: number;
    created_at: Date;
    updated_at: Date | null;
    date: Date;
}

