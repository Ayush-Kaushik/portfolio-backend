import type { Context } from "@netlify/functions";
import { collection, addDoc } from 'firebase/firestore/lite';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

interface Contact extends ReadableStream<Uint8Array<ArrayBufferLike>> {
  name: string,
  email: string,
  message: string
}

export default async (request: Request, context: Context) => {

  try {
    var contact: Contact = await validateRequestBody(request);

    const app = initializeApp({
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL:  process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID
    });

    const db = getFirestore(app);

    // add the data to collection
    let documentReference = await addDoc(collection(db, "contacts"), {
      name: contact.name,
      email: contact.email,
      message: contact.message
    });

    console.log("Contact information added to firestore collection: contacts ", documentReference.id);

  } catch (exception) {

    if (exception.cause == "invalid-data") {
      return Response.error();
    }

    console.log("Error adding document: ", exception);
    return Response.error();

  }

  return new Response("Someone contacted me!");
}


const validateRequestBody = async (request: Request): Promise<Contact> => {
  var contact: Contact = await request.json();

  if (contact.name == "" || contact.name == null) {
    throw new Error("name is invalid");
  }

  if (contact.email == "" || contact.email == null) {
    throw new Error("email is invalid", { cause: "invalid-data" });
  }

  if (contact.message == "" || contact.message == null) {
    throw new Error("message is invalid", { cause: "invalid-data" });
  }

  return contact;
}
