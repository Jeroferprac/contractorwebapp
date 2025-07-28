import NextAuth from "next-auth";
import { authOptions } from "../../../app/lib/authOptions";

export default NextAuth(authOptions); 