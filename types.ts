
export enum AppView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface MetricData {
  label: string;
  value: string;
  change: string;
  isUp: boolean;
  icon: string;
}

export interface Transaction {
  id: string;
  customer: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Canceled';
  date: string;
}
