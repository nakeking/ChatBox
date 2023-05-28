import React, { FC } from 'react'

import {
    MessageOutlined,
    MoreOutlined
} from '@ant-design/icons';
import { SuiCorrugation } from '../../components';

type DialogueType = {
  id: number
  title: string
}[]

const Dialogues: FC = () => {
    const dialogues: DialogueType = [
      {id: 1, title: "Untitled"},
      {id: 2, title: "Untitled"},
      {id: 3, title: "Untitled"}
    ]

    return (
        <div className='dialogues'>
            <div className='title'>对话</div>

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