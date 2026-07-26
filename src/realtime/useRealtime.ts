import { useContext } from "react";
import RealtimeContext from "./realtimeContext";

const useRealtime = () => useContext(RealtimeContext);

export default useRealtime;
