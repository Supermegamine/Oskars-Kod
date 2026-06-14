export type Activity = {
  id: string;
  title: string;
  description: string | null;
  activity_date: string | null;
  activity_time: string | null;
  location: string | null;
  added_by: string;
  created_at: string;
};

export type ActivityInput = {
  title: string;
  description: string;
  activity_date: string;
  activity_time: string;
  location: string;
  added_by: string;
};
