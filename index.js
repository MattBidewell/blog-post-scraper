import * as http from "http";
import * as crypto from "crypto";
import { getMediumPosts } from "medium-articles";

const username = "mattbidewell";
const port = 80;
const tempUrl = "https://ignoreme.com"

async function getPosts(username) {
  const postsData = await getMediumPosts(username);

  const formattedPosts = postsData.posts.map((post) => {
    const title = post.title;
    const link = post.link;
    const fullSnippet = post["content:encodedSnippet"];
    // todo: instead, lets start at character 200 and work our way back to nearest fullstop. Add the ellipsis there
    const arr = fullSnippet.split("").slice(0, 200);
    arr.push("...");
    const shortenedSnippet = arr.join("");
    return {
      title,
      link,
      snippet: shortenedSnippet,
    };
  });

  return formattedPosts;
}

function getUsername(req) {
  const url = new URL(tempUrl + req.url);
  const params = url.searchParams;
  const username = params.get("username");
  if (username) {
    return username;
  } else {
    throw new Error('username not found in req', req);
  }
}

async function handleRequest(req, res) {
  try {
    // should catch any requests I'm not expecting...
    if (!req.url.startsWith("/?username=")) {
      res.writeHead(404).end();
      return;
    }

    res.setHeader("Content-type", "application/json");
    const username = getUsername(req);
    const jsonResponse = await getPosts(username);
    res.end(JSON.stringify(jsonResponse, null, 2));
    return;
  } catch (err) {
    // catch all
    const uid = crypto.randomUUID();
    const errMessage = {
      "error": "opps error, contact creator with the following URL and UID",
      "url": req.url,
      "uid": uid
    }

    const log = {
      errorMessage: errMessage,
      errorLog: err,
      uid,
    }
    console.log(log)
    res.end(JSON.stringify(errMessage, null, 2));
  }
}

const server = http.createServer(handleRequest);

server.listen(port, (err) => {
  if (err) {
    return console.log("Error: ", err);
  }
  console.log(`running on port ${port}`);
});

