import { Request, Response, NextFunction } from "express";

const userLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;
};

const registerUser = (req: Request, res: Response) => {
  const { name, email, password, confirm_password } = req.body;
};

export { userLogin, registerUser };
