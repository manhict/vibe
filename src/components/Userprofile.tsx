import Profile from "./common/Profile";
import Login from "./common/Login";
import { getLoggedInUser } from "@/app/actions/getLoggedInUser";

async function Userprofile() {
  const user = await getLoggedInUser();

  return <>{user ? <Profile user={user} /> : <Login />}</>;
}

export default Userprofile;
