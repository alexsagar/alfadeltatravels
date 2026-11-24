// Enquiry validation, shared by the form and its unit test.
export type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;

export function validate(data: { name: string; email: string; message: string; consent: boolean }): Errors {
  const e: Errors = {};
  if (data.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) e.email = "Please enter a valid email address, for example name@example.com.";
  if (data.message.trim().length < 20) e.message = "Please tell us a little about your plans (at least 20 characters).";
  if (!data.consent) e.consent = "Please confirm we may use these details to reply to you.";
  return e;
}
