import 'next-auth'

declare module 'next-auth' {
    interface User {
        _id?: string;
        isverified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
    interface Session {
        user: {
            _id?: string;
            isverified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;    
        } & DefaultSession['user'];
    }
}

declare module 'next-auth' {
    interface JWT {
        user: {
            _id?: string;
            isverified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        }
    }
}