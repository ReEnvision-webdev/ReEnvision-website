export interface StandardResponse {
  success: boolean;
  message: string | null;
  data: Record<string, unknown> | Array<Record<string, unknown>> | null;
  error: string | null;
}
