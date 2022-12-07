import { serve } from "./deps.js";
import { connectDB, insertMessage, queryAllMessages, queryMessageById, queryAllReplies } from "./db.js";

let dbClient;
try {
  dbClient = await connectDB();
} catch (error) {
  console.error(error);
  Deno.exit(1);
}

const httpResponse = (object, status) => {
  return new Response(JSON.stringify(object), {
    status: status
  });
}

const httpMessageResponse = (message, status) => {
  return httpResponse({
    'message': message
  }, status);
}

const handleRequest = async (request) => {
  const url = new URL(request.url)
  const pathname = url.pathname;
  console.log(`method: ${request.method}, pathname: ${pathname}`);

  // index
  if (request.method === 'GET' && pathname === '/') {
    return httpMessageResponse('api server index', 200);
  }

  // get message(s)
  if (request.method === 'GET' && pathname === '/message') {
    // get() returns null if there isn't such param
    const messageid = url.searchParams.get('messageid');

    let result;
    if (messageid !== null) {
      console.log('Get message by id:', messageid);
      result = await queryMessageById(dbClient, messageid);
    } else {
      console.log('Get all messages');
      result = await queryAllMessages(dbClient);
    }

    return httpResponse(result, 200);
  }

  // get replies
  if (request.method === 'GET' && pathname === '/replies') {
    // get() returns null if there isn't such param
    const messageid = url.searchParams.get('messageid');
    if (messageid === null) {
      return httpMessageResponse('missing messageid', 400);
    }

    const result = await queryAllReplies(dbClient, messageid);
    return httpResponse(result, 200);
  }

  // add a new meaasge/reply
  if (request.method === 'POST' && pathname === '/message') {
    const message = await request.json();
    console.log('Inserting message:', message);
    await insertMessage(dbClient, message);
    return httpMessageResponse('insert message success', 201)
  }

  console.error('No matching pathname');
  return httpMessageResponse('page not found', 404);
};

serve(handleRequest, { port: 7777 });
