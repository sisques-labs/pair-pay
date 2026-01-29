// Types for Balance feature

export type UserBalance = {
  userId: string;
  email: string;
  fullName: string | null;
  totalPaid: number;
  totalOwed: number;
  balance: number; // Positive = they owe you, Negative = you owe them
};

export type CoupleBalance = {
  user1: UserBalance;
  user2: UserBalance;
  netBalance: number; // Absolute amount one owes the other
  owedBy: string; // userId of who owes money
  owedTo: string; // userId of who is owed money
};

export type Settlement = {
  id: string;
  coupleId: string;
  fromUser: string;
  toUser: string;
  amount: number;
  settledAt: Date;
  notes: string | null;
};

export type SettlementWithUsers = Settlement & {
  fromUserProfile: {
    id: string;
    email: string;
    fullName: string | null;
  };
  toUserProfile: {
    id: string;
    email: string;
    fullName: string | null;
  };
};

export type CreateSettlementResponse = {
  success: boolean;
  settlement?: Settlement;
  error?: string;
};
