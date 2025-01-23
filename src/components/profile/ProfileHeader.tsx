import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, User } from "lucide-react";

interface ProfileHeaderProps {
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    specialty: string | null;
    bio: string | null;
  } | null;
  isOwnProfile: boolean;
  onEdit: () => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, onEdit }: ProfileHeaderProps) => {
  return (
    <div className="relative w-full bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile?.full_name || "Add your name"}</h1>
            <p className="text-lg text-muted-foreground mt-1">
              {profile?.specialty || (isOwnProfile ? "Add your specialty" : "")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              {profile?.bio || (isOwnProfile ? "Add a bio to tell others about yourself" : "")}
            </p>
          </div>
        </div>
        {isOwnProfile && (
          <Button onClick={onEdit} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};