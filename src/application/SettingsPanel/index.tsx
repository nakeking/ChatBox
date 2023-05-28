import { FC, useContext, useEffect, useReducer, useState } from "react";

import {
    BulbOutlined,
    BulbFilled
} from '@ant-design/icons'
import { Modal, Radio, Button, Input } from 'antd'
import useThemeHook, { themeType } from "../../hooks/useThemeHook";
import { getStore } from "../../utils";

interface SettingsPanelProp {
    open: boolean,
    cancelSetUp: Function
}

const SettingsPanel: FC<SettingsPanelProp> = (prop) => {
    let { open, cancelSetUp } = prop;

    const handleOk = () => {
        cancelSetUp()
    }

    // =============== 设置主题 ===============================
    const [theme, setTheme] = useState<themeType>()
    const { handleToggleTheme } = useThemeHook()

    // 获取缓存主题设置，默认"light"
    useEffect(() => {
        const storedTheme = getStore('theme')
        setTheme(storedTheme?.themeType || 'light')
    }, [])

    const handleThemeChange = (theme: themeType) => {
        setTheme(theme)

        handleToggleTheme(theme)
    }
    
    return (
        <Modal
            className='setUpModal'
            open={open}
            title="设置"
            closable={false}
            footer={[
                <Button type="text" key="back" onClick={ () => cancelSetUp()}>
                    取消
                </Button>,
                <Button type="text" key="submit" onClick={handleOk}>
                    保存
                </Button>,
            ]}>
                <div className='modal_body'>
                    <div className="">
                        <Input placeholder="Borderless" bordered={false} />
                    </div>

                    <span className='title'>主题</span>
                    <Radio.Group value={theme} buttonStyle="solid" onChange={(e) => handleThemeChange(e.target.value)}>
                        <Radio.Button value="light">
                            <BulbOutlined />
                        </Radio.Button>
                        <Radio.Button value="dark">
                            <BulbFilled />
                        </Radio.Button>
                    </Radio.Group>
                </div>
        </Modal>
    )
}

export default SettingsPanel