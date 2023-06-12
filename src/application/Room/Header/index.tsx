import { FC, useContext, useEffect } from "react";

import {
    MessageOutlined,

    RestFilled,
    SaveFilled
} from '@ant-design/icons';
import ChatBoxContext from "../../../context";

const Header: FC = () => {
    const { state } = useContext(ChatBoxContext)
    const { currentDialogue, Dialogues } = state

    return (
        <div className="header">
            { currentDialogue?.id ? (
                <>
                <div className="left">
                    <span className="iconBase"><MessageOutlined /></span>
                    <span className="title">{currentDialogue?.name}</span>
                </div>
                <div className="right">
                    <span className="iconBase"><RestFilled /></span>
                    <span className="iconBase"><SaveFilled /></span>
                </div>
                </>
            ) : <></> }
        </div>
    )
}

export default Header