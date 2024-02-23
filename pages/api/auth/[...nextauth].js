import clientPromise from "../../../lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter"; // Actualizado al nuevo paquete
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { unstable_getServerSession as getServerSession } from "next-auth/next"; // Cambiado según la nueva importación

const adminEmails = [
  "tomas.millan96@gmail.com",
  "orionaceros.info@gmail.com",
  "silnolu33@gmail.com",
  "toniolanus@gmail.com",
  "alexisandoval1971@gmail.com",
  "tano.ballan@gmail.com",
];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Aquí puedes agregar otros proveedores si es necesario
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return null; // Cambiado de false a null según las nuevas convenciones
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401).end();
    throw new Error('not an admin'); // Cambiado para lanzar un Error en lugar de un string
  }
}
