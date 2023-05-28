import React, { FC, useState } from 'react'

import {
    PlusOutlined,
    SettingFilled,
    ExclamationCircleOutlined
} from '@ant-design/icons';

import { Corrugation } from '../../components';
import SettingsPanel from '../SettingsPanel';

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
            
            <SettingsPanel 
                open={openModal} 
                cancelSetUp={ cancelSetUp }/>
        </div>
    )
}

export default Options