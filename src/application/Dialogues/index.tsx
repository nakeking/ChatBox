import React, { FC, useState } from 'react'

import {
    MessageOutlined,
    MoreOutlined
} from '@ant-design/icons';
import { SuiCorrugation } from '../../components';
import { useTranslation } from 'react-i18next';

type DialogueType = {
  id: number
  title: string
}[]

const Dialogues: FC = () => {
  const {t} = useTranslation()

  const [ dialogues ] = useState<DialogueType>([
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
      <div className='dialogues'>
          <div className='title'>{t("Dialogues.dialogues")}</div>

          <div className='dialogue'>
            { dialogues.map(dialogue => {
              return (
                <SuiCorrugation key={dialogue.id}>
                  <div className='item'>
                    <MessageOutlined />
                    <div className='title'>{dialogue.title}</div>
                    <div className='more'>
                      <MoreOutlined />
                    </div>
                  </div>
                </SuiCorrugation>
              )
            })}
          </div>
      </div>
  )
}

export default Dialogues