import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface ProfileFormProps {
  open: boolean;
  onClose: () => void;
  profile: {
    id: string;
    full_name: string | null;
    specialty: string | null;
    bio: string | null;
    phone_number: string | null;
    ahpra_number: string | null;
  } | null;
  onProfileUpdate: () => void;
}

export const ProfileForm = ({ open, onClose, profile, onProfileUpdate }: ProfileFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    specialty: profile?.specialty || "",
    bio: profile?.bio || "",
    phone_number: profile?.phone_number || "",
    ahpra_number: profile?.ahpra_number || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          specialty: formData.specialty,
          bio: formData.bio,
          phone_number: formData.phone_number,
          ahpra_number: formData.ahpra_number,
        })
        .eq("id", profile?.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Your changes have been saved.",
      });
      onProfileUpdate();
      onClose();
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="h-32"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="ahpra">AHPRA Number</Label>
              <Input
                id="ahpra"
                value={formData.ahpra_number}
                onChange={(e) =>
                  setFormData({ ...formData, ahpra_number: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};