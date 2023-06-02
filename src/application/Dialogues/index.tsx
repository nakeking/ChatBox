import React, { FC, useEffect, useId, useState } from 'react'

import {
    MessageOutlined,
    MoreOutlined,

    EditFilled,
    DeleteFilled
} from '@ant-design/icons';
import { SuiCorrugation } from '../../components';
import { useTranslation } from 'react-i18next';
import { Divider, Popover } from 'antd';

type DialogueType = {
  id: number
  title: string
}

const Dialogues: FC = () => {
  const {t} = useTranslation()
  const [ popupContainer, setPopupContainer ] = useState<HTMLElement>()

  useEffect(() => {
    setPopupContainer(document.getElementById('dialogues') as HTMLElement)
  }, [popupContainer])

  const [ dialogues ] = useState<DialogueType[]>([
    {id: 1, title: "Untitled"},
    {id: 2, title: "Untitled"},
    {id: 3, title: "Untitled"},
    {id: 4, title: "Untitled"},
    {id: 5, title: "Untitled"},
    {id: 6, title: "Untitled"},
    {id: 7, title: "Untitled"},
    {id: 8, title: "Untitled"},
    {id: 9, title: "Untitled"},
    {id: 10, title: "Untitled"}
  ])

  return (
      <div id='dialogues' className='dialogues'>
          <div className='title'>{t("Dialogues.dialogues")}</div>

          <div className='dialogue webkitScrollbarBase'>
            { dialogues.map(dialogue => {
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
                <div className='popItem'>
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