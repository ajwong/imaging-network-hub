import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { CreatePost } from "@/components/feed/CreatePost";
import { useState } from "react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import { format } from "date-fns";

type PostWithProfile = Database['public']['Tables']['posts']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null
};

const Feed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          profiles!posts_user_id_fkey(*)
        `)
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error fetching posts:", postsError);
        throw postsError;
      }

      return (postsData || []) as PostWithProfile[];
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
    <div className="grid grid-cols-12 gap-6 py-6">
      {/* Left Sidebar */}
      <div className="col-span-2 hidden lg:block">
        <div className="sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  All Posts
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Clinical Cases
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Research
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Discussion
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-12 lg:col-span-7">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Community Feed</h1>
          <Button onClick={() => setShowCreatePost(true)}>Create Post</Button>
        </div>

        {showCreatePost && (
          <CreatePost onClose={() => setShowCreatePost(false)} />
        )}

        <div className="space-y-4">
          {posts?.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      Posted by {post.profiles?.full_name || post.profiles?.username || "Anonymous"} •{" "}
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
      </div>

      {/* Right Sidebar */}
      <div className="col-span-3 hidden lg:block">
        <div className="sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trending Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">Radiology AI Updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm">New Treatment Protocols</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-purple-500 rounded-full" />
                  <span className="text-sm">Medical Technology</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feed;