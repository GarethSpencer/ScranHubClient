import type GetUserResponse from "../models/responses/GetUserResponse";
import ApiClient from "../api/apiClient";
import { useQuery } from "@tanstack/react-query";
import Spinner from "react-bootstrap/esm/Spinner";

const UserInfo = () => {
  const apiClient = new ApiClient<GetUserResponse>("/user/me");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userInfo", "me"],
    queryFn: apiClient.get,
  });

  if (isLoading)
    return (
      <>
        <Spinner animation="border" role="status" />
        <p>Checking API connection...</p>
      </>
    );
  if (isError) return <p>Error occurred while fetching user info.</p>;

  return (
    <>
      <h2>API connection successful</h2>
      <p>
        Your initial userName is: {data?.user?.displayName}. Your status is: [
        {data?.user?.active ? "Active" : "Inactive"}]. Your Id is [
        {data?.user?.userId}].
      </p>
    </>
  );
};

export default UserInfo;
