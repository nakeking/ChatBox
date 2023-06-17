import { FC, useMemo, useState } from 'react'

import { Button, Modal } from 'antd'
import { MessageOutlined, RestFilled, SaveFilled } from '@ant-design/icons'
import { DialogueType } from '../../../types'
import { useTranslation } from 'react-i18next'

interface HeaderProps {
  Dialogue?: DialogueType

  onCleanDialogueMsg: () => void
}

const _Header: FC<HeaderProps> = (props) => {
  const { Dialogue, onCleanDialogueMsg } = props
  const { t } = useTranslation()

  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const handleCleanDialogueMsg = () => {
    setModalOpen(true)
  }

  const handleOk = () => {
    onCleanDialogueMsg()

    setModalOpen(false)
  }

  const handleCancel = () => {
    setModalOpen(false)
  }

  return (
    <div className="header">
      {Dialogue?.id ? (
        <>
          <div className="left">
            <span className="iconBase">
              <MessageOutlined />
            </span>
            <span className="title">{Dialogue?.name}</span>
          </div>
          <div className="right">
            <span className="iconBase" onClick={handleCleanDialogueMsg}>
              <RestFilled />
            </span>
            <span className="iconBase">
              <SaveFilled />
            </span>
          </div>

          <Modal
            title={t('common.Clean')}
            open={isModalOpen}
            closable={false}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button type="text" key="back" onClick={handleCancel}>
                {t('common.Cancel')}
              </Button>,
              <Button type="text" key="submit" onClick={handleOk}>
                {t('common.Save')}
              </Button>
            ]}
          >
            {t('common.CleanTip', { name: Dialogue.name })}
          </Modal>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default function Header(props: HeaderProps) {
  return useMemo(() => {
    return <_Header {...props} />
  }, [props.Dialogue?.id, props.Dialogue?.name])
}
