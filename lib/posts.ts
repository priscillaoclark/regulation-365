import GhostContentAPI, { PostOrPage } from "@tryghost/content-api";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  feature_image?: string;
  url: string; // Add url field
}

const api = new GhostContentAPI({
  url: process.env.GHOST_API_URL as string,
  key: process.env.GHOST_CONTENT_API_KEY as string,
  version: "v3",
});

export async function fetchLastFivePosts(): Promise<Post[]> {
  try {
    const posts = await api.posts.browse({
      limit: 5,
      order: "published_at DESC",
      fields: ["id", "title", "excerpt", "feature_image", "url"], // Include url field
    });

    return posts.map((post) => ({
      id: post.id!,
      title: post.title || "Untitled",
      excerpt: post.excerpt || "",
      feature_image: post.feature_image ?? undefined,
      url: post.url || "", // Map the url field
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}
