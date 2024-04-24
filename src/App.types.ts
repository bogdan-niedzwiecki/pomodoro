export type IntervalType = Interval.Session | Interval.Break;

export enum Interval {
  Session = "session",
  Break = "break",
}

export interface AppState {
  timer: number;
  session: number;
  break: number;
  isPulseAcive: { first: boolean; second: boolean };
  activeInterval: IntervalType;
  isTimerActive: boolean;
}
