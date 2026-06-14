export type Holiday = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  added_by: string;
  created_at: string;
};

export type HolidayInput = {
  title: string;
  start_date: string;
  end_date: string;
  added_by: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string | null;
  activity_date: string | null;
  activity_time: string | null;
  location: string | null;
  added_by: string;
  holiday_id: string | null;
  created_at: string;
};

export type ActivityInput = {
  title: string;
  description: string;
  activity_date: string;
  activity_time: string;
  location: string;
  added_by: string;
  holiday_id: string;
};
