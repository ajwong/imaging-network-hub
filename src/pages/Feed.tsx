import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreatePost } from "@/components/feed/CreatePost";
import { Sidebar } from "@/components/feed/Sidebar";
import { PostList } from "@/components/feed/PostList";

const Feed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2 hidden lg:block">
        <Sidebar />
      </div>

      <div className="col-span-12 lg:col-span-10 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Community Feed</h1>
            <Button onClick={() => setShowCreatePost(true)}>Create Post</Button>
          </div>

          {showCreatePost && (
            <CreatePost onClose={() => setShowCreatePost(false)} />
          )}

          <PostList />
        </div>
      </div>
    </div>
  );
};

export default Feed;