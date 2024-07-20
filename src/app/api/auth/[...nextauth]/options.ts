import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Session } from "inspector";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text"},
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({ 
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                     });

                     if(!user) {
                        throw new Error("No user found");
                     }

                     if(!user.isverified) {
                        throw new Error("User is not verified");
                     }

                     const passcheck = await bcrypt.compare(credentials.password, user.password);
                     if(passcheck) {
                        return user;
                     } else {
                        throw new Error("Password is incorrect");
                     }
                } catch (err: any) {
                    throw new Error(err);
                }
              }
        })
    ],
    callbacks: {
        async session({session, token}) {
            if(token) {
                session.user._id = token._id;
                session.user.isverified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        },
        async jwt({token, user}) {
            if(user) {
                token._id = user._id?.toString();
                token.isVerified = user.isverified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        }
    },
    pages: {
        signIn: "/signIn",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
