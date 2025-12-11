export interface LeadInterface {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  owner: OwnerInterface;
  tags: string[];
  createdAt: string;
  lastActivityAt: string;
  activities: ActivitiesInterface[];
}

export interface OwnerInterface {
  id: string;
  name: string;
}
export interface ActivitiesInterface {
  id: string;
  type: string;
  at: string;
  summary: string;
}
