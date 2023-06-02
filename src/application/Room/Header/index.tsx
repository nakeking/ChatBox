import { FC } from "react";

import {
    MessageOutlined,

    RestFilled,
    SaveFilled
} from '@ant-design/icons';

const Header: FC = () => {
    return (
        <div className="header">
            <div className="left">
                <span className="iconBase"><MessageOutlined /></span>
                <span className="title">Untitled</span>
            </div>
            <div className="right">
                <span className="iconBase"><RestFilled /></span>
                <span className="iconBase"><SaveFilled /></span>
            </div>
        </div>
    )
}

export default Header