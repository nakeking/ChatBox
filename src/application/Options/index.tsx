import React, { FC, useContext, useState } from 'react'

import {
  PlusOutlined,
  SettingFilled,
  ExclamationCircleOutlined
} from '@ant-design/icons'

import { SuiCorrugation } from '../../components'
import SettingsPanel from '../SettingsPanel'

import { useTranslation } from 'react-i18next'
import ChatBoxContext from '../../context'
import { openLink } from '../../utils'

const Options: FC = () => {
  // =============== 国际化 ================================
  const { t } = useTranslation()

  // =============== 设置对话框 =============================
  const [openModal, setOpenModal] = useState<boolean>(false)
  const handleSetUp = () => {
    setOpenModal(true)
  }

  const cancelSetUp = () => {
    setOpenModal(false)
  }

  // =============== 新建对话 ===============================
  const { _addDialogue } = useContext(ChatBoxContext)

  return (
    <div className="options">
      <SuiCorrugation>
        <div className="option Corrugation-root" onClick={_addDialogue}>
          <PlusOutlined />
          <p className="string">{t('options.newDialogue')}</p>
        </div>
      </SuiCorrugation>
      <SuiCorrugation>
        <div className="option Corrugation-root" onClick={handleSetUp}>
          <SettingFilled />
          <p className="string">{t('options.setUp')}</p>
        </div>
      </SuiCorrugation>
      <SuiCorrugation>
        <div
          className="option Corrugation-root"
          onClick={() => {
            openLink('https://github.com/nakeking/ChatBox')
          }}
        >
          <ExclamationCircleOutlined />
          <a className="string">{t('options.version') + ` : 0.01`}</a>
        </div>
      </SuiCorrugation>

      <SettingsPanel open={openModal} cancelSetUp={cancelSetUp} />
    </div>
  )
}

export default Options
