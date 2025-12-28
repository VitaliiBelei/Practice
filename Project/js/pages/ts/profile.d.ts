export type ProfileSettings = {
  language: string;
  theme: string;
  units: string;
};

export type Profile = {
  id?: string;
  name: string;
  email: string;
  password: string;
  foto: string;
  createdAt?: string;
  updatedAt?: string;
  profileId: string;
  settings?: ProfileSettings;
  location?: string;
  fc?: string;
  bio?: string;
  link?: string;
};

export type Session = {
  profileId: string;
  status: string;
  loggetAt: string;
};
