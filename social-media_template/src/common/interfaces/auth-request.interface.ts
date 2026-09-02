import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}
