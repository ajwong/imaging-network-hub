import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreatePost } from "@/components/feed/CreatePost";
import { Sidebar } from "@/components/feed/Sidebar";
import { PostList } from "@/components/feed/PostList";

const Feed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-6 px-4">
      <div className="col-span-2 hidden lg:block">
        <Sidebar />
      </div>

      <div className="col-span-12 lg:col-span-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Community Feed</h1>
            <Button 
              onClick={() => setShowCreatePost(true)}
              className="bg-primary hover:bg-primary-hover text-white"
            >
              Create Post
            </Button>
          </div>

          {showCreatePost && (
            <CreatePost onClose={() => setShowCreatePost(false)} />
          )}

          <PostList />
        </div>
      </div>

      <div className="col-span-2 hidden xl:block">
        {/* Right sidebar can be added here later */}
      </div>
    </div>
  );
};

export default Feed;