import z from "zod";

export const SignupSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
  type: z.enum(["user", "admin"]),
});

export const SigninSchema = z.object({
  usename: z.string().email(),
  password: z.string().min(8),
});

export const UpdateMetadataSchema = z.object({
  avatarId: z.string(),
});

export const CreateSpaceSchema = z.object({
  name: z.string(),
  dimension: z.string().regex(/^[0-9]{1,5}x[0-9]{1,5}$/),
  mapId: z.string(),
});

export const AddElementSchema = z.object({
  name: z.string(),
  x: z.number(),
  y: z.number(),
  elementId: z.string(),
});

export const CreateElementSchema = z.object({
  imaheUrl: z.string(),
  width: z.number(),
  height: z.number(),
  static: z.boolean(),
});


export const UpdateElementSchema = z.object({
  imageUrl: z.string(),
});

export const CreateAvatarSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
});

export const CreateMapSchema = z.object({
  thumbnail: z.string(),
  dimension: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  defaultElementId: z.array(z.object({
    elementId: z.string(),
    x: z.number(),
    y: z.number(),
  }))
});

