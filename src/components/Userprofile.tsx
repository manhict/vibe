import Profile from "./common/Profile";
import { getLoggedInUser } from "@/app/actions/getLoggedInUser";

async function Userprofile() {
  const user = await getLoggedInUser();

  return  <Profile user={user} />
}

export default Userprofile;
