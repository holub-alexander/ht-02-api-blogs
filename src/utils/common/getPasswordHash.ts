import { generateHash } from "../../business-layer/security/generate-hash";
import bcrypt from "bcrypt";

export const getPasswordHash = async (password: string): Promise<string> => {
  const passwordSalt = await bcrypt.genSalt(10);

  return generateHash(password, passwordSalt);
};
