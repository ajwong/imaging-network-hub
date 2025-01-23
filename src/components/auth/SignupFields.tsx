import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupFieldsProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  ahpraNumber: string;
  setAhpraNumber: (value: string) => void;
}

const SignupFields = ({
  phoneNumber,
  setPhoneNumber,
  ahpraNumber,
  setAhpraNumber,
}: SignupFieldsProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="ahpra">AHPRA Number</Label>
        <Input
          id="ahpra"
          type="text"
          placeholder="Enter your AHPRA number"
          value={ahpraNumber}
          onChange={(e) => setAhpraNumber(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SignupFields;