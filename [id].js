import { redis } from "@/lib/redis";

export async function getServerSideProps({ params }) {
  const paste = await redis.get(`paste:${params.id}`);
  if (!paste) return { notFound: true };

  if (paste.expires_at && Date.now() >= paste.expires_at) {
    return { notFound: true };
  }

  if (paste.max_views && paste.views >= paste.max_views) {
    return { notFound: true };
  }

  return { props: { content: paste.content } };
}

export default function PasteView({ content }) {
  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: 20 }}>
      {content}
    </pre>
  );
}
