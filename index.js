import { getMediumPosts } from "medium-articles";

const username = "mattbidewell";

async function getPosts() {
  const data = await getMediumPosts(username);
  return data;
}

async function run() {
  const postsData = await getPosts();

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

run()
  .then((posts) => console.log(posts))
  .catch((err) => console.err(err));
