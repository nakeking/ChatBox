import React, { FC, useContext, useEffect, useId, useState } from 'react'

import {
    MessageOutlined,
    MoreOutlined,

    EditFilled,
    DeleteFilled
} from '@ant-design/icons';
import { SuiCorrugation } from '../../components';
import { useTranslation } from 'react-i18next';
import { Popover } from 'antd';
import ChatBoxContext from '../../context';

type DialogueType = {
  id: number
  title: string
}

const Dialogues: FC = () => {
  const { t } = useTranslation()
  
  const [ popupContainer, setPopupContainer ] = useState<HTMLElement>()
  useEffect(() => {
    setPopupContainer(document.getElementById('dialogues') as HTMLElement)
  }, [popupContainer])

  const { state } = useContext(ChatBoxContext)

  return (
      <div id='dialogues' className='dialogues'>
          <div className='title'>{t("Dialogues.dialogues")}</div>

          <div className='dialogue webkitScrollbarBase'>
            { state.Dialogues?.map(dialogue => {
              return (
                <DialogueItem 
                  key={dialogue.id} 
                  dialogue={dialogue} 
                  popupContainer={popupContainer as HTMLElement}/>
              )
            })}
          </div>
      </div>
  )
}

interface DialogueItemProps {
  dialogue: DialogueType,

  popupContainer: HTMLElement
}

const DialogueItem: FC<DialogueItemProps> = (props) => {
  const { dialogue, popupContainer } = props
  const { t } = useTranslation()

  const { _delDialogue } = useContext(ChatBoxContext)
  const handleDelete = () => {
    _delDialogue(dialogue.id)
  }

  return (
    <SuiCorrugation>
      <div className='dialogueItem'>
        <MessageOutlined />
        <div className='title'>{dialogue.title}</div>
        <div className='more iconBase'>
          <Popover
            overlayClassName="dialoguePop"
            placement="bottomRight"
            arrow={false}
            getPopupContainer={() => {
              return popupContainer
            }}
            content={
              <div className='popContent'>
                <div className='popItem'>
                  <EditFilled />{t("Dialogues.rename")}</div>
                <span className='hr'></span>
                <div className='popItem' onClick={handleDelete}>
                  <DeleteFilled />{t("Dialogues.delete")}</div>
              </div>
            }
            title={false}
            trigger="click">
            <MoreOutlined />
          </Popover>
        </div>
      </div>
    </SuiCorrugation>
  )
}

export default Dialogues