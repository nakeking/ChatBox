import { FC, useContext, useEffect, useMemo } from 'react'

import { MessageOutlined, RestFilled, SaveFilled } from '@ant-design/icons'
import ChatBoxContext from '../../../context'
import { DialogueType } from '../../../types'

interface HeaderProps {
  Dialogue?: DialogueType
}

const _Header: FC<HeaderProps> = (props) => {
  const { Dialogue } = props

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
            <span className="iconBase">
              <RestFilled />
            </span>
            <span className="iconBase">
              <SaveFilled />
            </span>
          </div>
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
