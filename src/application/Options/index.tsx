import React, { FC, useState } from 'react'
import { shell } from 'electron'

import {
    PlusOutlined,
    SettingFilled,
    ExclamationCircleOutlined
} from '@ant-design/icons';

import { SuiCorrugation } from '../../components';
import SettingsPanel from '../SettingsPanel';
import { Button } from 'antd';

const Options: FC = () => {
    // =============== 设置对话框 =============================
    const [openModal, setOpenModal] = useState<boolean>(false)
    const handleSetUp = () => {
        setOpenModal(true)
    }

    const cancelSetUp = () => {
        setOpenModal(false)
    }

    // =============== 新建对话 ===============================
    const handleAddDialogue = () => {

    }

    // =============== openUrl ==============
    const openUrl = (evt: React.MouseEvent) => {
        evt.preventDefault()

        const url = "https://github.com/nakeking/ChatBox"
        shell.openExternal(url)
    }

    return (
        <div className='options'>
            <SuiCorrugation>
                <div className='option Corrugation-root' onClick={handleAddDialogue}>
                    <PlusOutlined />
                    <p className='string'>新对话</p>
                </div>
            </SuiCorrugation>
            <SuiCorrugation>
                <div className="option Corrugation-root" onClick={handleSetUp}>
                    <SettingFilled />
                    <p className='string'>设置</p>
                </div>
            </SuiCorrugation>
            <SuiCorrugation>
                <div className='option Corrugation-root' onClick={openUrl}>
                    <ExclamationCircleOutlined />
                    <a className='string'>版本：0.01</a>
                </div>
            </SuiCorrugation>
            
            <SettingsPanel 
                open={openModal} 
                cancelSetUp={ cancelSetUp }/>
        </div>
    )
}

export default Options