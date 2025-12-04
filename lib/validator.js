import express from 'express'
import {validationResult} from 'express-validator'

const validate = validations => {
  return async (req, res, next) => {

      for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
    }

    next();
  };
};

export default validate;