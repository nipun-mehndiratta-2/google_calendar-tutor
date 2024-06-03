import { z } from "zod"

export const validateField = (value, schema) => {
    try {
      schema.parse(value);
      return('');
    } catch (error) {
      return(error.errors[0].message);
    }
};


export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(4, { message: "Password must be at least 4 characters long" });
