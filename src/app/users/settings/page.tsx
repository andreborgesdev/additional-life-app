"use client";

import { useEffect, useState, useRef } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import {
  User,
  Bell,
  Shield,
  MapPin,
  Upload,
  Check,
  X,
  Mail,
  MessageSquare,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { toast } from "@/src/hooks/use-toast";
import { useSession } from "../../auth-provider";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useUpdateUser } from "@/src/hooks/users/use-update-user";
import { formatDate } from "@/src/utils/date-utils";
import { UpdateUserRequest } from "@/src/lib/generated-api";
import { PhoneInput } from "@/src/components/shared/phone-input";
import { uploadImage } from "@/src/lib/supabase/storage/client";
import { useLogout } from "@/src/hooks/auth/use-logout";
import { useUpdatePassword } from "@/src/hooks/users/use-update-password";
import useSupabaseBrowser from "@/src/lib/supabase/supabase-browser";
import { useUserByEmail } from "@/src/hooks/users/use-user-by-email";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useTranslation } from "react-i18next";

interface PasswordRequirementStatus {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  specialChar: boolean;
}

export default function UserSettingsPage() {
  const { session, isLoading: isLoadingSession } = useSession();
  const { data: userData, isLoading: isLoadingUserData } = useUserByEmail(
    session?.user?.email ?? null
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const logout = useLogout();
  const supabase = useSupabaseBrowser();
  const { t } = useTranslation("common");

  // User profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<UpdateUserRequest.preferredLanguage>(
    UpdateUserRequest.preferredLanguage.ENGLISH
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Contact preferences
  const [contactOptions, setContactOptions] = useState<
    Array<"EMAIL" | "PHONE" | "WHATSAPP">
  >([]);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [newItemNotifications, setNewItemNotifications] = useState(true);

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [locationPrecision, setLocationPrecision] = useState("neighborhood");

  // Account security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifyingCurrentPassword, setIsVerifyingCurrentPassword] =
    useState(false);
  const [passwordRequirements, setPasswordRequirements] =
    useState<PasswordRequirementStatus>({
      length: false,
      uppercase: false,
      number: false,
      specialChar: false,
    });

  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { mutate: updatePassword, isPending: isUpdatingPassword } =
    useUpdatePassword();

  useEffect(() => {
    if (!isLoadingSession && !session) router.replace("/auth/login");
  }, [router, session, isLoadingSession]);

  useEffect(() => {
    if (!isLoadingUserData && userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phoneNumber || "");
      setLocation(userData.address || "");
      setBio(userData.bio || "");
      setAvatarUrl(userData.avatarUrl || null);
      setLanguage(
        userData.preferredLanguage ||
          UpdateUserRequest.preferredLanguage.ENGLISH
      );
      setContactOptions(userData.contactOptions || []);
      setIsLoading(false);
    } else if (!isLoadingUserData && !userData) {
      setIsLoading(false);
    }
  }, [isLoadingUserData, userData]);

  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setAvatarPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setAvatarPreviewUrl(null);
  }, [avatarFile]);

  useEffect(() => {
    setPasswordRequirements({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      number: /\d/.test(newPassword),
      specialChar: /[^A-Za-z0-9]/.test(newPassword),
    });
  }, [newPassword]);

  const handleContactOptionToggle = (
    option: "EMAIL" | "PHONE" | "WHATSAPP"
  ) => {
    setContactOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  // Handle form submissions
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userData || !userData.id) {
      toast({
        title: "Error",
        description: "User data not available. Cannot update profile.",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: t("settings.name_required"),
        description: t("settings.enter_name"),
        variant: "destructive",
      });
      return;
    }
    if (!email.trim()) {
      toast({
        title: t("settings.email_required"),
        description: t("settings.enter_email"),
        variant: "destructive",
      });
      return;
    }

    if (bio.length > 250) {
      toast({
        title: t("settings.bio_too_long"),
        description: t("settings.bio_limit"),
        variant: "destructive",
      });
      return;
    }

    let avatarUrlForPayload = avatarUrl;

    if (avatarFile) {
      setIsUploadingAvatar(true);
      try {
        if (!session?.user?.id) {
          toast({
            title: t("settings.auth_error"),
            description: t("settings.session_not_found"),
            variant: "destructive",
          });
          setIsUploadingAvatar(false);
          return;
        }
        const uploadResult = await uploadImage({
          file: avatarFile,
          userId: session.user.id,
          bucket: "avatars",
        });

        if (uploadResult.error) {
          throw new Error(
            uploadResult.error || t("settings.avatar_upload_failed")
          );
        }
        avatarUrlForPayload = uploadResult.imageUrl;
        setAvatarUrl(avatarUrlForPayload);
        setAvatarFile(null);
      } catch (error: any) {
        toast({
          title: t("settings.avatar_upload_failed"),
          description: error.message || t("settings.avatar_upload_error"),
          variant: "destructive",
        });
        setIsUploadingAvatar(false);
        return;
      } finally {
        setIsUploadingAvatar(false);
      }
    }

    const profileData: UpdateUserRequest = {
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phone.trim() || undefined,
      address: location.trim() || undefined,
      bio: bio.trim() || undefined,
      avatarUrl: avatarUrlForPayload || undefined,
      preferredLanguage: language,
      isEmailVerified: session?.user.user_metadata.email_verified || false,
      isPhoneVerified: session?.user.user_metadata.phone_verified || false,
      contactOptions: contactOptions,
    };

    updateUser(
      { userId: userData.id, userData: profileData },
      {
        onSuccess: async (updatedUserData) => {
          toast({
            title: t("settings.profile_updated"),
            description: t("settings.profile_saved"),
            variant: "success",
          });
        },
        onError: (error) => {
          toast({
            title: t("settings.update_failed"),
            description: error.message || t("settings.update_error"),
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleNotificationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: t("settings.notifications_updated"),
      description: t("settings.notifications_saved"),
    });
  };

  const handlePrivacySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Privacy settings updated",
      description: "Your privacy settings have been saved successfully.",
    });
  };

  const handleChangePasswordSubmit = async (
    e?: React.FormEvent<HTMLFormElement> // Optional if called from button click
  ) => {
    if (e) e.preventDefault();

    if (!session?.user?.email) {
      toast({
        title: "Error",
        description: "User session not found. Cannot update password.",
        variant: "destructive",
      });
      return;
    }

    if (!currentPassword) {
      toast({
        title: "Current password required",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }

    if (!newPassword) {
      toast({
        title: "New password required",
        description: "Please enter a new password.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirm password must be the same.",
        variant: "destructive",
      });
      return;
    }

    const { length, uppercase, number, specialChar } = passwordRequirements;
    if (!length || !uppercase || !number || !specialChar) {
      toast({
        title: "Password not strong enough",
        description: "Please ensure your new password meets all requirements.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingCurrentPassword(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: currentPassword,
      });

      if (signInError) {
        // Check if the error is specifically about invalid credentials
        if (
          signInError.message
            .toLowerCase()
            .includes("invalid login credentials")
        ) {
          toast({
            title: "Incorrect Current Password",
            description: "The current password you entered is incorrect.",
            variant: "destructive",
          });
        } else {
          throw signInError; // Re-throw other sign-in errors
        }
        setIsVerifyingCurrentPassword(false);
        return;
      }

      // Current password verified, proceed to update
      updatePassword(
        { newPassword },
        {
          onSuccess: () => {
            toast({
              title: "Password updated",
              description: "Your password has been changed successfully.",
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
          },
          onError: (error) => {
            toast({
              title: "Password update failed",
              description: error.message || "Could not update your password.",
              variant: "destructive",
            });
          },
          onSettled: () => {
            setIsVerifyingCurrentPassword(false);
          },
        }
      );
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description:
          error.message ||
          "An error occurred while verifying your current password.",
        variant: "destructive",
      });
      setIsVerifyingCurrentPassword(false);
    }
  };

  const handleAvatarButtonClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast({
          title: "File too large",
          description: "Avatar image must be less than 2MB.",
          variant: "destructive",
        });
        return;
      }
      setAvatarFile(file);
    }
  };

  const handleLogout = () => {
    logout.mutate();
  };

  if (isLoadingSession || isLoadingUserData || isLoading) {
    return <UserSettingsSkeleton />;
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarPreviewUrl || avatarUrl} alt={name} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-muted-foreground">
              Member since {formatDate(userData?.createdAt)}
            </p>
            {/* <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              <Badge variant="outline" className="bg-green-50">
                5 Items Shared
              </Badge>
              <Badge variant="outline" className="bg-blue-50">
                3 Items Received
              </Badge>
            </div> */}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>
                {language.charAt(0) + language.slice(1).toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {userData?.isEmailVerified ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <span>{t("settings.email_verified")}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.profile")}</span>
          </TabsTrigger>
          {/* <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger> */}
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.security")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.profile_information")}</CardTitle>
              <CardDescription>
                {t("settings.update_personal_info")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("settings.full_name")}</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("settings.name_placeholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t("settings.email_address")}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("settings.email_placeholder")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {t("settings.phone_number")}
                      </Label>
                      <PhoneInput
                        id="phone"
                        value={phone}
                        onChange={setPhone}
                        placeholder={t("settings.phone_placeholder")}
                        defaultCountry="CH"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">{t("settings.location")}</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={t("settings.location_placeholder")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">{t("settings.bio")}</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={t("settings.bio_placeholder")}
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">
                      {bio.length}/250 {t("settings.characters")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar">
                      {t("settings.profile_picture")}
                    </Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={avatarPreviewUrl || avatarUrl || undefined}
                          alt={name || undefined}
                        />
                        <AvatarFallback>
                          {name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={handleAvatarButtonClick}
                        type="button"
                        disabled={isUploadingAvatar}
                      >
                        <Upload className="h-4 w-4" />
                        {isUploadingAvatar
                          ? t("settings.uploading")
                          : t("settings.upload_new_picture")}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">
                      {t("settings.preferred_language")}
                    </Label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) =>
                        setLanguage(
                          e.target.value as UpdateUserRequest.preferredLanguage
                        )
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {Object.values(UpdateUserRequest.preferredLanguage).map(
                        (lang) => (
                          <option key={lang} value={lang}>
                            {lang.charAt(0) + lang.slice(1).toLowerCase()}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        {t("settings.contact_preferences")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.contact_description")}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="contact-email"
                          checked={contactOptions.includes("EMAIL")}
                          onClick={() => handleContactOptionToggle("EMAIL")}
                        />
                        <Label
                          htmlFor="contact-email"
                          className="flex items-center gap-2 font-normal"
                        >
                          <Mail className="h-4 w-4" />
                          {t("settings.email")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="contact-phone"
                          checked={contactOptions.includes("PHONE")}
                          onClick={() => handleContactOptionToggle("PHONE")}
                        />
                        <Label
                          htmlFor="contact-phone"
                          className="flex items-center gap-2 font-normal"
                        >
                          <Phone className="h-4 w-4" />
                          {t("settings.phone_call_message")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="contact-whatsapp"
                          checked={contactOptions.includes("WHATSAPP")}
                          onClick={() => handleContactOptionToggle("WHATSAPP")}
                        />
                        <Label
                          htmlFor="contact-whatsapp"
                          className="flex items-center gap-2 font-normal"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {t("settings.whatsapp")}
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUpdatingUser || isUploadingAvatar}
                  >
                    {isUpdatingUser || isUploadingAvatar
                      ? t("settings.saving")
                      : t("settings.save_profile_changes")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        {/* <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications from Additional
                Life
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Communication Channels
                  </h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="email-notifications"
                          className="font-normal"
                        >
                          Email Notifications
                        </Label>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="push-notifications"
                          className="font-normal"
                        >
                          Push Notifications
                        </Label>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <Label
                            htmlFor="message-notifications"
                            className="font-normal"
                          >
                            Messages
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          Receive notifications when someone sends you a message
                        </p>
                      </div>
                      <Switch
                        id="message-notifications"
                        checked={messageNotifications}
                        onCheckedChange={setMessageNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <Label
                            htmlFor="new-item-notifications"
                            className="font-normal"
                          >
                            New Items
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          Receive notifications about new items in your area
                        </p>
                      </div>
                      <Switch
                        id="new-item-notifications"
                        checked={newItemNotifications}
                        onCheckedChange={setNewItemNotifications}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Save Notification Settings</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Privacy Tab */}
        {/* <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control what information is visible to others and how your data
                is used
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePrivacySubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Visibility</h3>
                  <div className="space-y-2">
                    <Label htmlFor="profile-visibility">
                      Who can see your profile
                    </Label>
                    <select
                      id="profile-visibility"
                      value={profileVisibility}
                      onChange={(e) => setProfileVisibility(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="public">Everyone (Public)</option>
                      <option value="registered">Registered Users Only</option>
                      <option value="connections">My Connections Only</option>
                    </select>
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="show-email" className="font-normal">
                            Show Email Address
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          Allow others to see your email address on your profile
                        </p>
                      </div>
                      <Switch
                        id="show-email"
                        checked={showEmail}
                        onCheckedChange={setShowEmail}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="show-phone" className="font-normal">
                            Show Phone Number
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          Allow others to see your phone number on your profile
                        </p>
                      </div>
                      <Switch
                        id="show-phone"
                        checked={showPhone}
                        onCheckedChange={setShowPhone}
                      />
                    </div>
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">Location Privacy</h3>
                  <div className="space-y-2">
                    <Label htmlFor="location-precision">
                      Location Precision
                    </Label>
                    <select
                      id="location-precision"
                      value={locationPrecision}
                      onChange={(e) => setLocationPrecision(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="exact">Exact Address</option>
                      <option value="neighborhood">Neighborhood</option>
                      <option value="city">City Only</option>
                    </select>
                    <p className="text-sm text-muted-foreground">
                      This controls how precisely your location is shown to
                      others
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Save Privacy Settings</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your password and account security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Password Requirements:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        {passwordRequirements.length ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                        <span>At least 8 characters long</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordRequirements.uppercase ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                        <span>Contains uppercase letters</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordRequirements.number ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                        <span>Contains numbers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordRequirements.specialChar ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                        <span>Contains special characters</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    type="button"
                    onClick={() => handleChangePasswordSubmit()}
                    disabled={isUpdatingPassword || isVerifyingCurrentPassword}
                  >
                    {isUpdatingPassword || isVerifyingCurrentPassword
                      ? "Changing..."
                      : "Change Password"}
                  </Button>

                  <Separator />
                  {/* 
                  <h3 className="text-lg font-medium">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="two-factor" className="font-normal">
                          Two-Factor Authentication
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">Login Alerts</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="login-alerts" className="font-normal">
                          Login Alerts
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        Receive alerts when someone logs into your account
                      </p>
                    </div>
                    <Switch
                      id="login-alerts"
                      checked={loginAlerts}
                      onCheckedChange={setLoginAlerts}
                    />
                  </div>

                  <Separator /> */}

                  <h3 className="text-lg font-medium">Account Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                      type="button"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </Button>
                    {/* <Button
                      variant="outline"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out of All Devices
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Deactivate Account
                    </Button> */}
                  </div>
                </div>

                {/* The form-level submit button is removed as Change Password button handles it now */}
                {/* <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUpdatingPassword || isVerifyingCurrentPassword}
                  >
                    {isUpdatingPassword || isVerifyingCurrentPassword
                      ? "Saving..."
                      : "Save Security Settings"}
                  </Button>
                </div> */}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserSettingsSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="text-center md:text-left">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              <Skeleton className="h-6 w-24 rounded" />
              <Skeleton className="h-6 w-24 rounded" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-full mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-40 w-full rounded" />
        <Skeleton className="h-40 w-full rounded" />
        <Skeleton className="h-40 w-full rounded" />
        <Skeleton className="h-40 w-full rounded" />
      </div>
    </div>
  );
}
