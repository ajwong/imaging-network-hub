import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { CreatePost } from "@/components/feed/CreatePost";
import { useState } from "react";
import { toast } from "sonner";

const Feed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
      return data;
    },
  });

  const handleVote = async (postId: string, voteType: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to vote");
      return;
    }

    try {
      const { data: existingVote } = await supabase
        .from("votes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          await supabase.from("votes").delete().eq("id", existingVote.id);
          toast.success("Vote removed");
        } else {
          await supabase
            .from("votes")
            .update({ vote_type: voteType })
            .eq("id", existingVote.id);
          toast.success("Vote updated");
        }
      } else {
        await supabase.from("votes").insert({
          post_id: postId,
          user_id: user.id,
          vote_type: voteType
        });
        toast.success("Vote recorded");
      }
    } catch (error) {
      toast.error("Error voting on post");
    }
  };

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community Feed</h1>
        <Button onClick={() => setShowCreatePost(true)}>Create Post</Button>
      </div>

      {showCreatePost && (
        <CreatePost onClose={() => setShowCreatePost(false)} />
      )}

      <div className="space-y-6">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Posted by {post.profiles?.username || "Anonymous"} •{" "}
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{post.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(post.id, true)}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {post.upvotes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(post.id, false)}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  {post.downvotes}
                </Button>
              </div>
              <Link to={`/post/${post.id}`}>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Discuss
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Feed;