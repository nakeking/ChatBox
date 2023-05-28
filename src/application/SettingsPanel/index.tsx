import { FC, useEffect, useState } from "react";

import {
    BulbOutlined,
    BulbFilled
} from '@ant-design/icons'
import { Modal, Radio, Button, Input, Select } from 'antd'
import useThemeHook, { themeType } from "../../hooks/useThemeHook";
import { getStore } from "../../utils";
import { SuiLabel } from "../../components";

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
            getContainer={false}
            footer={[
                <Button type="text" key="back" onClick={ () => cancelSetUp()}>
                    取消
                </Button>,
                <Button type="text" key="submit" onClick={handleOk}>
                    保存
                </Button>,
            ]}>
                <div className='modal_body'>
                    <div className="formItem">
                        <SuiLabel placeholder="OpenAI API密钥" >
                            <Input bordered={false} />
                        </SuiLabel>
                    </div>

                    <div className="formItem">
                        <SuiLabel placeholder="语言" >
                            <Select style={{width: '100%'}} bordered={false}/>
                        </SuiLabel>
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