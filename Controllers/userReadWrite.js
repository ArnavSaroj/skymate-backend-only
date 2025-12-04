import bcrypt from "bcrypt";
import { supabase } from "../Config/supabaseClient.js";

export const create_User = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const saltRounds = 10;
    const hashedpwd = await bcrypt.hash(password, saltRounds);

    const { data: existingUsers, error: selectError } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`);

    if (selectError) {
      return res.status(400).json({ message: selectError.message });
    }
    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([
        { username, email, password: hashedpwd }
      ]);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({ message: "successful" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}