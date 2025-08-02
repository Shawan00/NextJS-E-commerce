"use client";

import { useState, useRef } from "react";
import { CustomerType } from "@/schemaValidation/auth.schema";
import { updateCustomerInfo } from "@/service/user";
import { uploadFile } from "@/service/uploadFile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, X, User, Mail, Phone, MapPin, Camera } from "lucide-react";
import { showToast } from "@/helper/toast";
import { getAvatarFallback } from "@/helper/general";

interface ProfileFormProps {
  customer: CustomerType;
}

export default function ProfileForm({ customer }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CustomerType>(customer);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof CustomerType, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!customer.id) return;

    setIsLoading(true);
    try {
      let avatarUrl = customer.avatar;

      if (avatarFile) {
        const formData = new FormData();
        formData.append('files', avatarFile);
        const urls = await uploadFile(formData);
        if (urls && urls.length > 0) {
          avatarUrl = urls[0];
        }
      }

      const updatedData = {
        ...formData,
        avatar: avatarUrl
      };

      const result = await updateCustomerInfo(customer.id, updatedData);
      
      if (result) {
        showToast("success", "Profile updated successfully!");
        window.location.reload();
      } else {
        showToast("error", "Failed to update profile!");
      }
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to update profile!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(customer);
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">
          Profile Information
        </CardTitle>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage 
                src={avatarPreview || customer.avatar || ""} 
                alt={customer.fullName}
              />
              <AvatarFallback className="text-lg">
                {getAvatarFallback(customer.fullName)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              value={formData.phone || ""}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter phone number"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </Label>
            <Input
              value={formData.address || ""}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter address"
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex flex-row-reverse gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-accent hover:bg-accent/95"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 