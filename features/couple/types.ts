// Types for Couple feature

export type Couple = {
  id: string;
  invitationCode: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CoupleWithMembers = Couple & {
  members: Array<{
    id: string;
    email: string;
    fullName: string | null;
  }>;
};

export type CreateCoupleResponse = {
  success: boolean;
  couple?: Couple;
  error?: string;
};

export type JoinCoupleResponse = {
  success: boolean;
  couple?: Couple;
  error?: string;
};
