import { ClubOutputs } from "@/server/api/root";
import JoinedClubCard from "./JoinedClubCard";

type Props = {
  initialClubs: ClubOutputs["getJoinedClubs"]["items"];
};

const Clubs = ({ initialClubs }: Props) => {
  return (
    <>
      {initialClubs.map((club) => (
        <JoinedClubCard club={club} key={club.id} />
      ))}
    </>
  );
};

export default Clubs;
