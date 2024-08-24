import { check, validationResult } from "express-validator";

export const userSignupValidator = (req, res, next) => {
  // Validate name
  check("name", "Name is required").notEmpty().run(req);

  // Validate email
  check("email", "Email must be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Invalid email")
    .isLength({ min: 4, max: 2000 })
    .run(req);

  // Validate password
  check("password", "Password is required").notEmpty().run(req);
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .run(req);

  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  // Proceed to next middleware
  next();
};

export const passwordResetValidator = (req, res, next) => {
  // Validate new password
  check("newPassword", "Password is required").notEmpty().run(req);
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .run(req);

  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  // Proceed to next middleware
  next();
};
