import { Router } from "express";
import { spaceRouter } from "./space";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { SignupSchema } from "../../types";
import { hash, compare } from "../../scrypt";
import { SigninSchema } from "../../types";
import client from "@repo/db/client";
import Jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "src/config";

export const router = Router();

router.post("/signup", async (req, res) => {
  const parseData = SignupSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({ message: "Invalid data" });
    return;
  }
  const hashedPassword = await hash(parseData.data.password);

  try {
    const user = await client.user.create({
      data: {
        username: parseData.data.username,
        password: hashedPassword,
        role: parseData.data.type === "admin" ? "Admin" : "User",
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(400).json({ message: "Error creating user" });
    return;
  }
});

router.post("/signin", async (req, res) => {
  const parseData = SignupSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(403).json({ message: "Invalid data" });
    return;
  }
  try {
    const user = await client.user.findUnique({
      where: {
        username: parseData.data.username,
      },
    });
    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }
    const isPasswordValid = await compare(
      parseData.data.password,
      user.password
    );
    if (!isPasswordValid) {
      res.status(403).json({ message: "Invalid password" });
      return;
    }

    const token = Jwt.sign({ userId: user.id, role: user.role }, JWT_PASSWORD);
    res.json({
      token,
    });
  } catch (e) {
    res.status(400).json({ message: "Internal server error" });
    return;
  }
});

router.get("/elements", (req, res) => {});

router.get("/avatars", (req, res) => {});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
