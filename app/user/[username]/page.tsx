import UserClient from "./UserClient";

// In the below function we use param which means it takes the parameters from the dynamic route the is directory we are using and after resolving the promise we get the username which we can later pass to UserClient page for getting more details from the username
export default async function Page({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;
    return <UserClient username={username} />;
}
