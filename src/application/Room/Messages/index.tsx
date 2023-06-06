import { FC } from "react";

import Block from './Block'

const Messages: FC = () => {
    return (
        <div className="message webkitScrollbarBase">
            <Block id={"1"} msg={{id: "2", role: "system"}} />
        </div>
    )
}

export default Messages