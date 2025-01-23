import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      toast({
        title: "Error loading profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <ProfileHeader
        profile={profile}
        isOwnProfile={true}
        onEdit={() => setShowEditForm(true)}
      />
      
      <ProfileForm
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
    </div>
  );
};

export default Profile;