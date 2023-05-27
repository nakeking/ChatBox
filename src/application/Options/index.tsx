import React, { FC, useContext, useEffect, useState } from 'react'

import {
    PlusOutlined,
    SettingFilled,
    ExclamationCircleOutlined,

    BulbFilled,
    BulbOutlined
} from '@ant-design/icons';
import { Button, Radio, Modal } from 'antd';

import useThemeHook, { themeInterface, themeType } from '../../hooks/useThemeHook';
import ChatBoxContext from '../../context';
import { Corrugation } from '../../components';
import { getStore } from '../../utils';

const Options: FC = () => {
    // =============== 设置对话框 =============================
    const [openModal, setOpenModal] = useState<boolean>(false)
    const handleSetUp = () => {
        setOpenModal(true)
    }

    const handleCancel = () => {
        setOpenModal(false)
    }

    const handleOk = () => {
        setOpenModal(false)
    }

    // =============== 新建对话 ===============================
    const handleAddDialogue = () => {

    }

    // =============== 设置主题 ===============================
    const [theme, setTheme] = useState<themeType>()
    const { _ToggleTheme } = useContext(ChatBoxContext)

    useEffect(() => {
        const storedTheme = getStore('theme')
        setTheme(storedTheme?.themeType || 'light')
    }, [])

    const handleThemeChange = (theme: themeType) => {
        setTheme(theme)

        _ToggleTheme(theme)
    }

    return (
        <div className='options'>
            <Corrugation>
                <div className='option Corrugation-root' onClick={handleAddDialogue}>
                    <PlusOutlined />
                    <p className='string'>新对话</p>
                </div>
            </Corrugation>
            <Corrugation>
                <div className="option Corrugation-root" onClick={handleSetUp}>
                    <SettingFilled />
                    <p className='string'>设置</p>
                </div>
            </Corrugation>
            <Corrugation>
                <div className='option Corrugation-root'>
                    <ExclamationCircleOutlined />
                    <p className='string'>版本：0.01</p>
                </div>
            </Corrugation>
            
            <Modal
                className='setUpModal'
                open={openModal}
                title="设置"
                closable={false}
                footer={[
                    <Button type="text" key="back" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button type="text" key="submit" onClick={handleOk}>
                        保存
                    </Button>,
                ]}>
                    <div className='modal_body'>
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
        </div>
    )
}

export default Options