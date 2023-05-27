import { FC } from "react";

import Header from "./Header";
import Prompt from "./Prompt";
import Messages from "./Messages";

const Room: FC = () => {
    return (
        <div className="room">
            <Header />
            <Messages />
            <Prompt />
        </div>
    )
}

export default Room