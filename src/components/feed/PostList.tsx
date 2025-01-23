import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Post = Database['public']['Tables']['posts']['Row'];
type PostWithProfile = Post & { 
  profile: Profile | null;
};

export const PostList = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('user_id', 'profiles.id')
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error fetching posts:", postsError);
        throw postsError;
      }

      return postsData as PostWithProfile[];
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
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-pulse">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  Posted by {post.profile?.full_name || "Anonymous"} •{" "}
                  {format(new Date(post.created_at), "PPp")}
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
                className="hover:bg-green-50"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {post.upvotes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(post.id, false)}
                className="hover:bg-red-50"
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
  );
};