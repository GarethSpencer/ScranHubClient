import type { HttpStatusCode } from "axios";

export default interface CommonResponse {
  statusCode: HttpStatusCode;
  message?: string;
}
