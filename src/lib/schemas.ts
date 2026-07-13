// ─── Zod Schemas ─────────────────────────────────────────────
import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  phone: z
    .string()
    .min(11, 'Phone number must be at least 11 digits')
    .regex(/^01[0-9]{9}$/, 'Enter a valid Egyptian mobile number (e.g. 01XXXXXXXXX)'),
  altPhone: z
    .string()
    .regex(/^(01[0-9]{9})?$/, 'Enter a valid Egyptian mobile number or leave blank')
    .optional()
    .or(z.literal('')),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  governorate: z.string().min(1, 'Please select a governorate'),
  city: z.string().min(2, 'City / District is required'),
  address: z.string().min(5, 'Please enter your full address'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['cod', 'card']),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const newsletterSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
